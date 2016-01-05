const gulp         = require('gulp');
const stylus       = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require('gulp-rename');
const browserSync  = require('browser-sync');
const plumber      = require('gulp-plumber');
const replace      = require('gulp-replace');
const report 	   = require('../report-error.js');

//compile styl to css and autoprefix
gulp.task('css-dev', function() {
	gulp.src('src/css/config.styl')
		.pipe(plumber({ errorHandler: report }))
		.pipe(stylus())
		.pipe(autoprefixer())
		.pipe(rename('main.css'))
		.pipe(gulp.dest('dist/dev/css'))
		.pipe(browserSync.reload({stream:true}));
});

//compile all styl and autoprefix, and minify
gulp.task('css-prod', function() {
	gulp.src('src/css/config.styl')
		.pipe(stylus())
		.pipe(autoprefixer())
		.pipe(replace(/\.\.\/assets/g, 'assets'))
		.pipe(rename('main.css'))
		.pipe(gulp.dest('.tmp/css'));
});
