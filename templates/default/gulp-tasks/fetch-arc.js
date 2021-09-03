const gulp = require('gulp');
const request = require('request');
const fs = require('fs');

const configPath = `${process.cwd()}/data/config.json`;
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { arc } = config.copy;

require('dotenv').config();

/**
 *
 * @param {string} storyId
 * @param {request.RequestCallback} cb
 */
const fetchStory = (storyId, cb) => {
  const subdomain = `${arc.sandbox ? 'sandbox.' : ''}bostonglobe`;
  const apiUrl = `https://api.${subdomain}.arcpublishing.com/content/v4`;

  const searchParams = new URLSearchParams();
  searchParams.set('website', 'bostonglobe');
  searchParams.set('published', 'false');
  searchParams.set(
    'included_fields',
    [
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
  );
  searchParams.set('_id', storyId);

  const bearerToken = arc.sandbox
    ? process.env.ARC_ACCESS_TOKEN_SANDBOX
    : process.env.ARC_ACCESS_TOKEN_PRODUCTION;
  const requestConfig = {
    url: `${apiUrl}?${searchParams.toString()}`,
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  };

  request.get(requestConfig, cb);
};

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

    const promises = arc.stories.map(storyId => new Promise((resolve, reject) => {
      fetchStory(
        storyId,
        (error, response, body) => {
          if (error) {
            reject(error);
          } else if (response.statusCode !== 200) {
            reject(new Error(`HTTP error ${response.statusCode}\n${body}`));
          } else {
            const parsedBody = JSON.parse(body);
            const file = `data/arc-${parsedBody.slug || storyId}.json`;
            fs.writeFile(file, body, (err) => {
              if (err) {
                console.error(err);
              }
              resolve(file);
            });
          }
        },
      );
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
