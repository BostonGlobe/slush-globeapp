const gulp = require('gulp');
const request = require('request');
const fs = require('fs');
const lzString = require('lz-string');
const archieml = require('archieml');
const Thumbor = require('thumbor-lite');
const { get, noop } = require('lodash');

const configPath = `${process.cwd()}/data/config.json`;
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { arc } = config.copy;

require('dotenv').config();

const requestGet = requestOptions => new Promise((resolve, reject) => {
  const bearerToken = arc.sandbox
    ? process.env.ARC_ACCESS_TOKEN_SANDBOX
    : process.env.ARC_ACCESS_TOKEN_PRODUCTION;

  const options = {
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  request.get(
    options,
    (err, response, body) => {
      if (err) {
        reject(err);
      } else if (!response) {
        reject(new Error('Unknown error'));
      } else if (response.statusCode !== 200) {
        reject(new Error(`HTTP error ${response.statusCode}\n${body}`));
      } else {
        resolve({ response, body });
      }
    },
  );
});

/**
 * Fetches a story.
 * @param {string} storyId
 * @return {Promise<{response: string, body: any}>}
 */
const fetchStory = (storyId) => {
  const subdomain = `${arc.sandbox ? 'sandbox.' : ''}bostonglobe`;
  const apiUrl = `https://api.${subdomain}.arcpublishing.com/content/v4`;

  const requestConfig = {
    url: apiUrl,
    qs: {
      website: 'bostonglobe',
      published: 'false',
      included_fields: [
        '_id',
        'website_url',
        'headlines',
        'subheadlines',
        'description',
        'credits',
        'content_elements',
        'promo_items',
        'related_content.basic',
        'slug',
      ].join(','),
      _id: storyId,
    },
  };

  return requestGet(requestConfig);
};

/**
 * Fetches an image.
 * @param {string} imageId
 * @return {Promise<{}>}
 */
const fetchImage = imageId => new Promise((resolve) => {
  const subdomain = `${arc.sandbox ? 'sandbox.' : ''}bostonglobe`;
  const apiUrl = `https://api.${subdomain}.arcpublishing.com/photo/api/v2/photos/${imageId}`;
  const baseUrl = arc.sandbox ? 'https://arc-sandbox.bostonglobe.com' : 'https://www.bostonglobe.com';

  requestGet({
    url: apiUrl,
    qs: {
      maxWidth: 1024,
    },
  }).then(({ body }) => {
    const parsedBody = JSON.parse(body);

    const parseCredit = (credits) => {
      if (!credits) {
        return undefined;
      }
      const name = get(credits, 'by[0].name');
      const affiliation = get(credits, 'affiliation[0].name');
      if (!affiliation) {
        return name;
      }
      return `${name}/${affiliation}`;
    };

    const makeAbsolute = (origUrl) => {
      if (!origUrl) {
        return undefined;
      }

      const result = new URL(origUrl, baseUrl);
      return result.toString();
    };

    const imageWidths = [240, 480, 640, 1024, 2048];

    /**
     *
     * @type {string}
     */
    const fullSize = get(parsedBody, 'additional_properties.fullSizeResizeUrl');
    if (!fullSize) {
      console.error(`No full size image found for image ${imageId}`);
      resolve({});
    }

    const imagePath = fullSize.split('/').slice(-3).join('/');

    const resizeImage = (width) => {
      const thumbor = new Thumbor(
        process.env.THUMBOR_TOKEN,
        `${baseUrl}/resizer`,
      );
      thumbor.setImagePath(imagePath);
      thumbor.width = width;
      return thumbor.buildUrl();
    };
    const srcSet = imageWidths.map(width => (`${resizeImage(width)} ${width}w`)).join(', ');

    const imageData = {
      credit: parseCredit(parsedBody.credits),
      caption: get(parsedBody, 'caption'),
      fullSize: makeAbsolute(parsedBody.additional_properties.fullSizeResizeUrl),
      srcSet,
      src: resizeImage(Math.max(...imageWidths)),
    };

    resolve(imageData);
  }).catch((err) => {
    console.error(`Error fetching image ${imageId}: ${err}`);
    resolve({});
  });
});

const processContentElement = contentElement => new Promise((resolve) => {
  // eslint-disable-next-line default-case
  switch (contentElement.type) {
    case 'reference':
      // image
      if (contentElement.referent && contentElement.referent.type === 'image') {
        fetchImage(contentElement.referent.id).then((image) => {
          resolve({
            _id: contentElement._id,
            image,
          });
        });
        return;
      }
      break;
    case 'image':
      fetchImage(contentElement._id).then((image) => {
        resolve({
          _id: contentElement._id,
          image,
        });
      });
      return;
    case 'custom_embed':
      if (contentElement.subtype === 'archieml') {
        let archieData = '{}';

        if (contentElement.embed.config && contentElement.embed.config.data) {
          archieData = JSON.parse(decodeURIComponent(contentElement.embed.config.data) || '{"archie":""}').archie;
        } else {
          const embedUrl = new URL(contentElement.embed.url);
          const compressedData = embedUrl.searchParams.get('data');
          if (compressedData) {
            archieData = JSON.parse(
              lzString.decompressFromEncodedURIComponent(compressedData) || '{"archie":""}',
            ).archie;
          }
        }

        resolve(archieml.load(archieData));
        return;
      }
      break;
  }

  resolve(contentElement);
});

gulp.task('fetch-arc', (cb) => {
  if (arc && arc.stories && arc.stories.length > 0) {
    // Check to see if there are valid access tokens.
    if (arc.sandbox && !process.env.ARC_ACCESS_TOKEN_SANDBOX) {
      console.error('ARC_ACCESS_TOKEN_SANDBOX is not set');
      cb();
      return;
    }
    if (!arc.sandbox && !process.env.ARC_ACCESS_TOKEN_PRODUCTION) {
      console.error('ARC_ACCESS_TOKEN_PRODUCTION is not set');
      cb();
      return;
    }
    if (!process.env.THUMBOR_TOKEN) {
      console.error('THUMBOR_TOKEN is not set');
      cb();
      return;
    }

    const promises = arc.stories.map(storyId => new Promise((resolve) => {
      fetchStory(storyId).then(({ body }) => {
        const parsedBody = JSON.parse(body);
        const file = `data/arc-${storyId}.json`;
        const parsePromises = parsedBody.content_elements.map(processContentElement);
        Promise.all(parsePromises).then((parsedElements) => {
          const result = {
            ...parsedBody,
            content_elements: parsedElements,
          };

          fs.writeFile(file, JSON.stringify(result, null, 2), (err) => {
            if (err) {
              console.error(err);
            }
            resolve(file);
          });
        });
      });
    }));

    Promise.all(promises)
      .then((fileNames) => {
        console.log(`Fetched ${fileNames.length} stories from Arc`);
        cb();
      })
      .catch((error) => {
        console.error(`Error fetching stories from Arc: ${error}`);
        cb();
      });
  }
});
