const gulp       = require('gulp');
const request    = require('request');
const fs         = require('fs');
const cheerio    = require('cheerio');
const teaserFile = process.cwd() + '/src/data/teaser.json';
const metaFile   = process.cwd() + '/src/data/meta.json';

gulp.task('fetch-teaser', function(cb) {
	fs.readFile(metaFile, 'utf8', function(err, data) {
		var urls = JSON.parse(data).teasers;
		if (urls.length) {
			fetchAllTeasers(urls, cb);
		} else {
			cb();
		}
		
	});	
});

const fetchAllTeasers = function(urls, cb) {
	var data = [];
	var fetchNext = function(index) {
		fetchTeaser(urls[index], function(err, datum) {
			if (!err && datum) {
				data.push(datum);
			}

			index++;
			if (index < urls.length) {
				fetchNext(index);
			} else {
				writeData(data, cb);
			}
		});
	};
	fetchNext(0);
};

const fetchTeaser = function(url, cb) {
	var datum = {};
	request(url, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			$ = cheerio.load(body);
			var titleRaw = $('title').first().text();
			var titleClean = titleRaw.split('- The Boston Globe')[0].trim();
			datum.url = url;
			datum.title = titleClean;
			
			var meta = $('meta');
			meta.each(function(i, el) {
				if(el.attribs.property && el.attribs.property === 'og:image') {
					var imageRaw = el.attribs.content;
					var imageHttps = imageRaw.replace('http://', 'https://');
					var imageFull = imageHttps.replace('image_585w', 'image_960w');
					datum.image = imageFull;
				}
			});
			cb(null, datum);
		} else {
			cb(true);
		}
	});
};

const writeData = function(data, cb) {
	const str = JSON.stringify(data);
	const file = 'src/data/teasers.json';

	fs.writeFile(file, str, function(err) {
		if (err) {
			console.log(err);
		}
		cb();
	});
};