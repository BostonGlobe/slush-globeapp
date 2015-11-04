var gulp = require('gulp');
var del = require('del');

//clear all prod folders and tmp dir
gulp.task('clean-prod', function(cb) {
	del(['.tmp/**', 'prod/**']).then(function() {
		cb();
	});
});
