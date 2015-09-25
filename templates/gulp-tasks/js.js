var gulp = require('gulp');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reportError = require('../report-error.js');

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
