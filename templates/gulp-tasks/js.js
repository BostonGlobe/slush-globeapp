const gulp        = require('gulp');
const babel       = require('gulp-babel');
const uglify      = require('gulp-uglify');
const plumber     = require('gulp-plumber');
const browserSync = require('browser-sync');
const reportError = require('../report-error.js');

gulp.task('js-dev', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(plumber({ errorHandler: reportError }))
		.pipe(babel())
		.pipe(gulp.dest('dist/dev/js'))
		.pipe(browserSync.reload({stream:true}));
});

//jshint and uglify js files
gulp.task('js-prod', function() {
	return gulp.src('src/js/**/*.js')
		.pipe(babel())
		.pipe(uglify())
		.pipe(gulp.dest('.tmp/js'));
});
