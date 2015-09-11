var gulp = require('gulp');
var del = require('del');

//clear all dev folders and sass cache
gulp.task('clean-dev', function(cb) {
	del(['.sass-cache']).then(function() {
		cb();
	});
});

//clear all prod folders and tmp dir
gulp.task('clean-prod', function(cb) {
	del(['.tmp/**', 'dist/prod/**']).then(function() {
		cb();
	});
});
