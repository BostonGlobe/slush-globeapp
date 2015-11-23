var gulp = require('gulp');
var archieml = require('archieml');
var request = require('request');
var fs = require('fs');
var configPath = process.cwd() + '/config.js';
var config = require(configPath).copy.google;

// GOOGLE DOC ID GOES HERE
var _url = 'https://docs.google.com/document/d/' + config.id + '/export?format=txt';

//clear all dev folders and sass cache
gulp.task('fetch-google', function(cb) {
	fetchCopy(cb);
});

function fetchCopy(cb) {
	if (config.id) {
		request(_url, function(error, response, body) {
			var parsed = archieml.load(body);
			var str = JSON.stringify(parsed);
			var file = 'src/data/' + (config.filename || 'copy')  + '.js';

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
