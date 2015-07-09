var gulp = require('gulp');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var replace = require('gulp-replace');

//compile styl to css and autoprefix
gulp.task('css-dev', function () {
	gulp.src('src/css/config.styl')
		.pipe(plumber({
	        errorHandler: function (err) { console.log(err); this.emit('end'); }
	    }))
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
		.pipe(minifycss())
		.pipe(rename('main.css'))
		.pipe(gulp.dest('.tmp/css'))	
});