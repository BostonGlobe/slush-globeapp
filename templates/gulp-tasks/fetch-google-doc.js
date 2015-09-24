var gulp = require('gulp');
var gcallback = require('gulp-callback');
var archieml = require('archieml');
var request = require('request');
var fs = require('fs');

// GOOGLE DOC ID GOES HERE
var _id = '1IiA5a5iCjbjOYvZVgPcjGzMy5PyfCzpPF-LnQdCdFI0';
var _url = 'https://docs.google.com/document/d/' + _id + '/export?format=txt';

//clear all dev folders and sass cache
gulp.task('fetch-google-doc', function(cb) {
	fetchCopy(cb);
});

function fetchCopy(cb) {
	if (_id) {
		request(_url, function(error, response, body) {
			var parsed = archieml.load(body);
			var str = JSON.stringify(parsed);
			var file = 'src/data/copy.json';

			fs.writeFile(file, str, function(err) {
				if (err) {
					console.log(err);
					cb();
				} else {
					cb();
				}
			});
		});
	} else {
		cb();
	}
}
