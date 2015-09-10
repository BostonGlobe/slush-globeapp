var gulp = require('gulp');
var shell = require('gulp-shell');

gulp.task('chmod-prod', shell.task([
  'chmod -R 775 dist/prod'
]));
