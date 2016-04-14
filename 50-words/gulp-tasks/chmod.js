const gulp    = require('gulp');
const shell   = require('shelljs');
const command = 'chmod -R 777 dist/prod';

gulp.task('chmod-prod', function(cb) {
	shell.exec(command);
	cb();
});
