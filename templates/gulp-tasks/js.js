const gulp        = require('gulp');
const babel       = require('gulp-babel');
const plumber     = require('gulp-plumber');
const browserSync = require('browser-sync');
const report 	  = require('../report-error.js');

gulp.task('js-dev', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(plumber({ errorHandler: report }))
		.pipe(babel())
		.pipe(gulp.dest('dist/dev/js'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('js-prod', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('.tmp/js'));
});
