const gulp = require('gulp');
const archieml = require('archieml');
const request = require('request')
const fs = require('fs');
const os = require('os');
const url = require('url');
const typogr = require('typogr');
const htmlparser = require('htmlparser2');
const Entities = require('html-entities').AllHtmlEntities;
const keyPath = os.homedir();
const { find, some } = require('lodash');

// Input and output files
const configPath = `${process.cwd()}/data/config.json`;
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const { story } = config.copy.google;


/**
* Parse the HTML downloaded and writes it to outFile (copy.json)
* @param html Raw HTML exported from the Google doc
*/
function parseHtml(html, filename) {
  let boldClass = []; //each doc should get its own boldClass
  let italicClass = [];
  // Modified from here https://github.com/newsdev/archieml-js/blob/master/examples/google_drive.js
  const handler = new htmlparser.DomHandler((error, dom) => {
    const tagHandlers = {
      _base({ attribs: { class: className }, children }) {
        const matchBold = className && boldClass !== '' && some(boldClass, boldClassName => className.indexOf(boldClassName) > -1);
        const matchItalic = className && italicClass !== '' && some(italicClass, italicClassName => className.indexOf(italicClassName) > -1);
        let str = '';
        // If the bold class matches the class name then wrap in an <strong>
        if (matchBold) {
          str += '<strong>'
        }
        if (matchItalic) {
          str += '<em>'
        }
        children.forEach(child => {
          // NOTE: This is not defined and I can't figure out what it is. But at least defining it makes it work as a task
          let func;
          if (func = tagHandlers[child.name || child.type]) str += func(child);
        });
        if (matchBold) {
          str += '</strong>'
        }
        if (matchItalic) {
          str+= '</em>'
        }
        return str;
      },
      text({ data }) {
        return data;
      },
      span(spanTag) {
        return tagHandlers._base(spanTag);
      },
      p(pTag) {
        return `${tagHandlers._base(pTag)}\n`;
      },
      a(aTag) {
        let href = aTag.attribs.href;
        let anchorAttributes = '';
        if (href === undefined) return '';

        // extract real URLs from Google's tracking
        // from: http://www.google.com/url?q=http%3A%2F%2Fwww.nytimes.com...
        // to: http://www.nytimes.com...
        if (aTag.attribs.href && url.parse(aTag.attribs.href, true).query && url.parse(aTag.attribs.href, true).query.q) {
          href = url.parse(aTag.attribs.href, true).query.q;
        } else if (aTag.attribs.href.indexOf('#poi') > -1) {
          const [ _, name ] = aTag.attribs.href.split('#poi-');
          anchorAttributes = ` class="nr-rmv-poi-button benton-italic-bold" data-poi-button="${name}"`;
        }

        let str = `<a href="${href}"${anchorAttributes}>`;
        str += tagHandlers._base(aTag);
        str += '</a>';
        return str;
      },
      li(tag) {
        return `* ${tagHandlers._base(tag)}\n`;
      }
    };

    ['ul', 'ol'].forEach(tag => {
      tagHandlers[tag] = tagHandlers.span;
    });
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
      tagHandlers[tag] = tagHandlers.p;
    });

    let body = dom[0].children.find(obj => obj.name === 'body');

    if (body.children.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      body = body.children[0];
    }
    // Get the bold class from the style tag string produced by the google doc export.
    // The class changes every time you fetch-html so we need to capture it using regex.
    const style = find(dom[0].children[0].children, obj => obj.type === 'style');
    // console.log(style);
    const cssString = style.children[0].data;
    const boldClassArr = cssString.match(/\.c\d+\{.*?\}/gm);
    const italicClassArr = cssString.match(/\.c\d+\{.*?\}/gm);

    boldClass = boldClassArr.reduce((classArr, individualCss) => {
      const boldMatches = individualCss.match(/\.(c\d+)\{.*?font-weight:700.*?\}/);
      if (boldMatches && boldMatches.length > 1) {
        return [...classArr, boldMatches[1]];
      } else {
        return classArr;
      }
    }, []);

    italicClass = italicClassArr.reduce((classArr, individualCss) => {
      const italicMatches = individualCss.match(/\.(c\d+)\{.*?font-style:italic.*?\}/);
      if (italicMatches && italicMatches.length > 1) {
        return [...classArr, italicMatches[1]];
      } else {
        return classArr;
      }
    }, []);


    let parsedText = tagHandlers._base(body);

    // Convert html entities into the characters as they exist in the google doc
    const entities = new Entities();
    parsedText = entities.decode(parsedText);

    // Remove smart quotes from inside tags
    parsedText = parsedText.replace(/<[^<>]*>/g, (match) => {
      return match.replace(/”|“/g, '"').replace(/‘|’/g, "'")
    });

    const parsed = archieml.load(parsedText);

    if (parsed.text) {
      parsed.text.forEach(el => {
        if (el.type === 'text') {
          el.value = typogr.smartypants(el.value);
        }
      });
    }

    // Write parsed archieml to copy.json
    const str = JSON.stringify(parsed);
    fs.writeFile(`data/${filename}.json`, str, (err) => {
      if (err) console.log(err);
    });
  });

  const parser = new htmlparser.Parser(handler);
  parser.write(html);
  parser.done();
}

/**
* Send a request to the Google Drive API to download the file as a raw html
*/
function exportDoc({ id, filename = 'copy' }) {
  const url = `https://docs.google.com/document/d/${id}/export?format=html`
  const exportOptions = {
    fileId: id,
    mimeType: 'text/html',
    response: {
      responseType: 'json'
    }
  };

  return request(url, (error, response, body) => {
    parseHtml(body, filename);
  });
}

gulp.task('fetch-html', (cb) => {
  if (story) {
    story.forEach((googleObj) => {
      exportDoc(googleObj);
    });
  } else {
    exportDoc(config.copy.google);
  }

  cb();
});
