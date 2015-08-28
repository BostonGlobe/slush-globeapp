var gulp = require('gulp');
var hb = require('gulp-hb');
var rename = require('gulp-rename');
var gcallback = require('gulp-callback');
var fs = require('fs');
var plumber = require('gulp-plumber');

var srcCopy = 'src/data/copy.json';
var srcIndex = 'src/html/index.hbs';

gulp.task('html-dev', function(cb) {

	handlebarsExists(function(err) {
		if (err) {
			cb();
		} else {
			// if you need to select a subset of data based on command line arg
			// var data = fs.readFileSync(srcCopy, {encoding: 'utf8'});
			// data = JSON.parse(data);
			gulp.src(srcIndex)
				.pipe(plumber({
					errorHandler: function(err) {
						console.log(err); this.emit('end');
					}
				}))
				.pipe(hb({
					data: 'src/data/*.json',
					helpers: 'src/html/helpers/*.js',
					partials: 'src/html/partials/**/*.hbs',
					bustCache: true,
					debug: false
				}))
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
					debug: false
				}))
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
