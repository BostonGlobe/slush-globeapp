var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var configPath = process.cwd() + '/story-config.js';
var config = require(configPath);
var base = 'http://prdedit.bostonglobe.com/eom/Boston/Content/';
var _queue = [];
var _output = '';

gulp.task('fetch-story', function(done) {
	if (config.story.length) {
		var next = function(index) {
			// fetch xml
			var url = base + config.section + '/Stories/' + config.story[index].slug + '.xml';
			console.log('fetching', url);
			request(url, function(error, response, body) {
				// did we get a valid response?
				if (!error && response.statusCode === 200) {
					// extract the html between content tags
					var content = body.match(/(<content>)([\s\S]*)(<\/content>)/)[2];

					// replace all the weird bits and bobs
					content = deMethodeify(content);

					// insert graphic templates
					content = content.replace(/<annotation.*(graphic:)(.*)<\/annotation>(.|[\r\n]+).*(<\/p>)/g, function(a, b, c) {
						return '</p>\n{{> graphic/graphic-' + c + '}}';
					});

					// replace photo tags with desired markup
					content = content.replace(/<photogrp-inline (.*?)>([\S\s]*?)<\/photogrp-inline>/g, function(a, b, c) {
						return createImageMarkup(c);
					});

					appendOutput(content, config.story[index]);

				} else {
					// http error. log and quit.
					console.log('error');
					console.log(JSON.stringify(error, null, 4));
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
				downloadImages();
			}
		};

		next(0);

	} else {
		console.error('No stories in story-config.js');
	}
});

function deMethodeify(content) {
	// remove notes
	content = content.replace(/<span class="@notes".*\/*.span>/g, '');
	content = content.replace(/<p class="@notes".*\/*.p>/g, '');

	// remove channel...
	content = content.replace(/<span.*channel=\"\!\".*\/*.span>/g, '');

	// replace *** with hr
	content = content.replace(/\<p\> *\*\*\* *\<\/p\>/g, '<hr>');

	// bold tag
	content = content.replace(/<b>/g, '<strong>');
	content = content.replace(/<\/b>/g, '</strong>');

	return content;
}

function createImageMarkup(c) {
	// match src
	var src = c.match(/<photo-inline (.*?) fileref="(.*?)" (.*?)>([\S\s]*?)<\/photo-inline>/)[2];

	// match alt (TODO: strip out html tags?)
	var alt = c.match(/<alt-tag (.*?)>([\S\s]*?)<\/alt-tag>/)[2];
	alt = alt.replace(/\<p\>|\<\/p\>/g,'');

	// match caption (TODO: strip out html tags?)
	var caption = c.match(/<caption (.*?)>([\S\s]*?)<\/caption>/)[2];
	caption = caption.replace(/\<p\>|\<\/p\>/g,'');

	// match credit (TODO: strip out html tags?)
	var credit = c.match(/<credit (.*?)>([\S\s]*?)<\/credit>/)[2];
	credit = credit.replace(/\<p\>|\<\/p\>/g,'');

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

	// populate download queue
	var imgSizes = {
		small: 585,
		medium: 1200,
		large: 1920
	};

	for (var sz in imgSizes) {
		_queue.push({
			url: 'http://prdedit.bostonglobe.com/rf/image_' + imgSizes[sz] + 'w' + params.imgPath,
			src: name + '_' + imgSizes[sz] + '.' + extension
		});
	}

	// start generating markup
	var src;
	var figure = '<figure>';

	if (params.lib === 'imager') {
		src = config.imageDirectory + '/' + name + '_{width}' + '.' + extension;
		figure += '<img data-src="' + src + '" alt="' + params.caption + '" class="img--replace" />';
	} else if (params.lib === 'picturefill') {
		figure += 'TODO';
	} else {
		src = config.imageDirectory + '/' + name + '_' + imgSizes.medium + '.' + extension;
		figure += '<img src="' + src + '" alt="' + params.caption + '/>';
	}

	figure += '<small>' + params.credit + '</small>';
	figure += '<figcaption>' + params.caption + '</figcaption>';
	figure += '</figure>';

	return figure;
}

function appendOutput(content, story) {
	_output += content;
}

function downloadImages() {
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
						if (err) { console.error(err); }
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
			process.exit();
		}
	};

	if (_queue.length) {
		next(0);
	}
}
