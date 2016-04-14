const gulp 			= require('gulp');
const hb 			= require('gulp-hb');
const rename 		= require('gulp-rename');
const gcallback 	= require('gulp-callback');
const include 		= require('gulp-file-include');
const fs 			= require('fs');
const plumber 		= require('gulp-plumber');
const report  		= require('../report-error.js');
const browserSync   = require('browser-sync');

const srcIndex = 'src/html/index.hbs';

const svgPath = process.cwd() + '/svg/';

gulp.task('html-dev', function() {

	const hbStream = hb()
		.partials('./src/html/partials/**/*.hbs')
		.helpers('./src/html/helpers/*.js')
		.data('./data/**/*.{js,json}')
		.data({timestamp: Date.now()})


	return gulp.src(srcIndex)
		.pipe(plumber({ errorHandler: report}))
		.pipe(hbStream)
		.pipe(include({ basepath: svgPath }))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('dist/dev'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('html-prod', function() {

	const hbStream = hb()
		.partials('./src/html/partials/**/*.hbs')
		.helpers('./src/html/helpers/*.js')
		.data('./data/**/*.{js,json}')
		.data({timestamp: Date.now()})

	return gulp.src(srcIndex)
		.pipe(hbStream)
		.pipe(include({ basepath: svgPath }))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('.tmp'));
});
