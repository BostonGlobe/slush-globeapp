const gulp 		= require('gulp');
const hb 		= require('gulp-hb');
const rename 	= require('gulp-rename');
const gcallback = require('gulp-callback');
const include 	= require('gulp-file-include');
const fs 		= require('fs');
const plumber 	= require('gulp-plumber');
const report  	= require('../report-error.js');

const srcMeta = 'data/meta.json';
const srcIndex = 'src/html/index.hbs';

const svgPath = process.cwd() + '/svg/';

gulp.task('html-dev', function(cb) {

	handlebarsExists(function(err) {
		if (err) {
			cb();
		} else {
			// if you need to select a subset of data based on command line arg
			// var data = fs.readFileSync(srcCopy, {encoding: 'utf8'});
			// data = JSON.parse(data);
			gulp.src(srcIndex)
				.pipe(plumber({ errorHandler: report}))
				.pipe(hb({
					data: 'data/*.json',
					helpers: 'src/html/helpers/*.js',
					partials: 'src/html/partials/**/*.hbs',
					bustCache: true,
					debug: false
				}))
				.pipe(include({ basepath: svgPath }))
				.pipe(rename('index.html'))
				.pipe(gulp.dest('dist/dev'))
				.pipe(gcallback(function() {
					cb();
				}));
		}
	});
});

gulp.task('html-prod', function(cb) {

	handlebarsExists(function(err) {
		if (err) {
			gulp.src('src/index.html')
			.pipe(gulp.dest('.tmp'))
			.pipe(gcallback(function() {
				cb();
			}));
		} else {
			gulp.src(srcIndex)
				.pipe(hb({
					data: 'data/*.json',
					helpers: 'src/html/helpers/*.js',
					partials: 'src/html/partials/**/*.hbs',
					bustCache: true,
					debug: false,
					dataEach: function (context, file) {
						context.isProduction = true;
						return context;
					}
				}))
				.pipe(include({ basepath: svgPath }))
				.pipe(rename('index.html'))
				.pipe(gulp.dest('.tmp'))
				.pipe(gcallback(function() {
					cb();
				}));
		}
	});
});

var handlebarsExists = function(cb) {
	fs.stat(srcIndex, function(err, file) {
		if (!err && file) {
			cb();
		} else {
			cb('No hbs file exists: src/html/index.hbs');
		}
	});
};
