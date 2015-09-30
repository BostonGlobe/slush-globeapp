var gulp = require('gulp');
var shell = require('shelljs');

var command = 'chmod -R 775 dist/prod';

gulp.task('chmod-prod', function(cb) {
	shell.exec(command);
	cb();
});