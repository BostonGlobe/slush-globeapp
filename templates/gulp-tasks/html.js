var gulp = require('gulp');
var hb = require('gulp-hb');
var rename = require('gulp-rename');
var gcallback = require('gulp-callback');
var include = require('gulp-file-include');
var fs = require('fs');
var plumber = require('gulp-plumber');
var reportError = require('../report-error.js');

var srcCopy = 'src/data/copy.json';
var srcIndex = 'src/html/index.hbs';

var svgPath = process.cwd() + '/svg/';

gulp.task('html-dev', function(cb) {

	handlebarsExists(function(err) {
		if (err) {
			cb();
		} else {
			// if you need to select a subset of data based on command line arg
			// var data = fs.readFileSync(srcCopy, {encoding: 'utf8'});
			// data = JSON.parse(data);
			gulp.src(srcIndex)
				.pipe(plumber({ errorHandler: reportError }))
				.pipe(hb({
					data: 'src/data/*.json',
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
					data: 'src/data/*.json',
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
