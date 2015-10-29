var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var configPath = process.cwd() + '/config.js';
var config = require(configPath).copy.methode;

var _queue = [];
var _output = '';

gulp.task('fetch-methode', function(cb) {
	if (config.story.length) {

		config.imageDirectory = config.imageDirectory || 'assets';

		var next = function(index) {
			// fetch xml
			var base = 'http://prdedit.bostonglobe.com/eom/Boston/Content/';
			var url = base + config.section + '/Stories/' + config.story[index].slug + '.xml';
			console.log('fetching', url);
			request(url, function(error, response, body) {
				// did we get a valid response?
				if (!error && response.statusCode === 200) {
					// extract the html between content tags
					var content = body.match(/(<content>)([\s\S]*)(<\/content>)/);

					if (content.length) {
						content = content[2];
						
						// replace all the weird bits and bobs
						content = deMethodeify(content);

						// insert graphic templates
						content = content.replace(/<annotation.*(graphic:)(.*)<\/annotation>(.*|[\r\n]+).*(<\/p>)/g, function(a, b, c) {
							return '</p>\n{{> graphic/graphic-' + c.trim() + '}}';
						});

						// replace photo tags with desired markup
						content = content.replace(/<photogrp-inline (.*?)>([\S\s]*?)<\/photogrp-inline>/g, function(a, b, c) {
							return createImageMarkup(c);
						});

						appendOutput(content, config.story[index]);

					} else {
						console.error('empty methode file, check config settings');
						advance(index);
					}

				} else {
					// http error. log and quit.
					console.error(JSON.stringify(error, null, 4));
					advance(index);
				}

				advance(index);
			});
		};

		var advance = function(index) {
			index++;
			if (index < config.story.length) {
				next(index);
			} else {
				fs.writeFileSync('src/html/partials/graphic/graphic.hbs', _output);
				downloadImages(cb);
			}
		};

		next(0);
	} else {
		console.error('No methode story');
		cb();
	}
});

function deMethodeify(content) {
	// remove notes
	content = content.replace(/<span class="@notes"(.|\n)*?\/span>/g, '');
	content = content.replace(/<p class="@notes"(.|\n)*?\/p>/g, '');

	// remove channel...
	content = content.replace(/<span.*channel=\"\!\".*\/*.span>/g, '');

	// remove empty p tags
	content = content.replace(/<p><\/p>/g, '');

	// replace *** with hr
	content = content.replace(/\<p\> *\*\*\* *\<\/p\>/g, '<hr>');

	// remove bold tag
	content = content.replace(/<b>/g, '');
	content = content.replace(/<\/b>/g, '');

	// -- to mdash
	content = content.replace(/--/g, '&mdash;');

	return content;
}

function createImageMarkup(c) {
	// match src
	var src = c.match(/<photo-inline (.*?) fileref="(.*?)" (.*?)>([\S\s]*?)<\/photo-inline>/)[2];

	// match caption and remove
	var caption = c.match(/<caption (.*?)>([\S\s]*?)<\/caption>/)[2];
	caption = caption.replace(/\<p\>|\<\/p\>/g,'').trim();

	// match credit and remove
	var credit = c.match(/<credit (.*?)>([\S\s]*?)<\/credit>/)[2];
	credit = credit.replace(/\<p\>|\<\/p\>/g,'').trim();

	var imgPath = src.split('?')[0];
	var figure = createFigure({
		lib: config.imageLibrary,
		imgPath: imgPath,
		caption: caption,
		credit: credit
	});
	return figure;
}

function createFigure(params) {
	var imgFull = params.imgPath.substr(params.imgPath.lastIndexOf('/') + 1);
	var imgSplit = imgFull.split('.');
	var name = imgSplit[0];
	var extension = imgSplit[1];
	var imageSizes = config.imageSizes.length ? config.imageSizes : [1200];

	for (var i in imageSizes) {
		_queue.push({
			url: 'http://prdedit.bostonglobe.com/rf/image_' + imageSizes[i] + 'w' + params.imgPath,
			src: name + '_' + imageSizes[i] + '.' + extension
		});
	}

	// start generating markup
	var src;
	var figure = '<figure>';

	if (params.lib === 'imager') {

		src = config.imageDirectory + '/' + name + '_{width}' + '.' + extension;
		figure += '<img data-src="' + src + '" alt="' + params.caption + '" class="delayed-image-load" />';

	} else if (params.lib === 'picturefill') {

		figure += '<picture>';
		figure += '<!--[if IE 9]><video style="display: none;"><![endif]-->';
		for (var j = imageSizes.length - 1; j > -1; j--) {
			src = config.imageDirectory + '/' + name + '_' + imageSizes[j] + '.' + extension;
			figure += '<source srcset="' + src  + '" ';
			if (j > 0) {
				figure += 'media="(min-width: ' + Math.floor(imageSizes[j-1] / 1.5) + 'px)"';
			} else {
				figure += 'media="(min-width: 1px)"';
			}

			figure += '>';
		}

		figure += '<!--[if IE 9]></video><![endif]-->';

		src = config.imageDirectory + '/' + name + '_' + imageSizes[0] + '.' + extension;
		figure += '<img srcset="' + src + '" alt="' + params.caption + '">';
		figure += '</picture>';

	} else if (params.lib === 'lazy-picturefill') {

		// picturefill + lazysizes.js (changes srcset to data-srcset)
		figure += '<picture>';
		figure += '<!--[if IE 9]><video style="display: none;"><![endif]-->';
		for (var j = imageSizes.length - 1; j > -1; j--) {
			src = config.imageDirectory + '/' + name + '_' + imageSizes[j] + '.' + extension;
			figure += '<source data-srcset="' + src  + '" ';
			if (j > 0) {
				figure += 'media="(min-width: ' + Math.floor(imageSizes[j-1] / 1.5) + 'px)"';
			} else {
				figure += 'media="(min-width: 1px)"';
			}

			figure += '>';
		}

		figure += '<!--[if IE 9]></video><![endif]-->';

		src = config.imageDirectory + '/' + name + '_' + imageSizes[0] + '.' + extension;
		figure += '<img class="lazyload" src="' + src + '" data-srcset="' + src + '" alt="' + params.caption + '">';
		figure += '</picture>';

	} else {

		// plain old image
		src = config.imageDirectory + '/' + name + '_' + imageSizes[0] + '.' + extension;
		figure += '<img src="' + src + '" alt="' + params.caption + '" />';

	}

	figure += '<small>' + params.credit + '</small>';
	figure += '<figcaption>' + params.caption + '</figcaption>';
	figure += '</figure>';

	return figure;
}

function appendOutput(content, story) {
	_output += content;
}

function downloadImages(cb) {
	var next = function(index) {
		var path = 'src/' + config.imageDirectory + '/' + _queue[index].src;
		try {
			var exists = fs.lstatSync(path);
			advance(index);
		} catch (e) {
			console.log('downloading', _queue[index].url);
			request(_queue[index].url, {encoding: 'binary'}, function(error, response, body) {
				if (error) {
					console.error(error);
					advance(index);
				} else {
					fs.writeFile(path, body, 'binary', function(err) {
						if (err) {
							console.error(err);
						}

						advance(index);
					});
				}
			});
		}
	};

	var advance = function(index) {
		index++;
		if (index < _queue.length) {
			next(index);
		} else {
			cb();
		}
	};

	if (_queue.length) {
		next(0);
	}
}
