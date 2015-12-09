var gulp = require('gulp');
var del = require('del');

gulp.task('clean-dev', function(cb) {
	del(['dist/dev/**']).then(function() {
		cb();
	});
});

//clear all prod folders and tmp dir
gulp.task('clean-prod', function(cb) {
	del(['.tmp/**', 'dist/prod/**']).then(function() {
		cb();
	});
});
