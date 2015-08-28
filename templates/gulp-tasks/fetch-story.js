var gulp = require('gulp');
var fs = require('fs');
var request = require('request');
var configPath = process.cwd() + '/story-config.js';
var config = require(configPath);
var base = 'http://prdedit.bostonglobe.com/eom/Boston/Content/';

gulp.task('fetch-story', function(done) {
	if (config.slug) {
		// fetch xml
		var url = base + config.section + '/Stories/' + config.slug + '.xml';
		request(url, function(error, response, body) {
			// did we get a valid response?
			if (!error && response.statusCode === 200) {
				// extract the bit between content
				var content = body.match(/(<content>)([\s\S]*)(<\/content>)/)[2];

				// replace no-text annotation with hbs tmeplate reference
				content = content.replace(/<annotation.*(graphic:)(.*)<\/annotation>(.|[\r\n]+).*(<\/p>)/g, function(a, b, c) {
					return '</p>\n{{> graphic/graphic-' + c + '}}';
				});

				// replace photo tags with desired structure
				content = content.replace(/<photogrp-inline (.*?)>([\S\s]*?)<\/photogrp-inline>/g, function(a, b, c) {

					// match src
					var src = c.match(/<photo-inline (.*?) fileref="(.*?)" (.*?)>([\S\s]*?)<\/photo-inline>/)[2];

					// match alt (TODO: strip out html tags?)
					var alt = c.match(/<alt-tag (.*?)>([\S\s]*?)<\/alt-tag>/)[2];

					// match caption (TODO: strip out html tags?)
					var caption = c.match(/<caption (.*?)>([\S\s]*?)<\/caption>/)[2];

					// match credit (TODO: strip out html tags?)
					var credit = c.match(/<credit (.*?)>([\S\s]*?)<\/credit>/)[2];

					// construct figure tag
					var figure = '<figure> <img src="' + src + '" alt="' + alt + '"/> <small>' + credit + '</small> <figcaption>' + caption + '</figcaption> </figure>';

					return figure;

				});

				// write content to graphic.hbs
				fs.writeFileSync('src/html/partials/graphic/graphic.hbs', content);
			} else {
				// http error. log and quit.
				console.log('error');
				console.log(JSON.stringify(error, null, 4));
				done();
			}
		});
	} else {
		console.error('No slug in story-config.js');
	}
});
