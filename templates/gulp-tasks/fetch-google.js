const gulp       = require('gulp');
const archieml   = require('archieml');
const request    = require('request');
const fs         = require('fs');
const configPath = process.cwd() + '/config.js';
const config     = require(configPath).copy.google;

// GOOGLE DOC ID GOES HERE
const _url = 'https://docs.google.com/document/d/' + config.id + '/export?format=txt';

//clear all dev folders and sass cache
gulp.task('fetch-google', function(cb) {
	fetchCopy(cb);
});

function fetchCopy(cb) {
	if (config.id) {
		request(_url, function(error, response, body) {
			const parsed = archieml.load(body);
			const str = JSON.stringify(parsed);
			const file = 'src/data/' + (config.filename || 'copy')  + '.json';

			fs.writeFile(file, str, function(err) {
				if (err) {
					console.log(err);
				}
				cb();
			});
		});
	} else {
		console.error('No google doc');
		cb();
	}
}
