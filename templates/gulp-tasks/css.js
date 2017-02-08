const gulp = require('gulp')
const stylus = require('gulp-stylus')
const autoprefixer = require('gulp-autoprefixer')
const combineMq = require('gulp-combine-mq')
const rename = require('gulp-rename')
const browserSync = require('browser-sync')
const plumber = require('gulp-plumber')
const replace = require('gulp-replace')
const report = require('./report-error.js')

//compile styl to css and autoprefix
gulp.task('css-dev', () => {
	gulp.src('src/css/config.styl')
		.pipe(plumber({ errorHandler: report }))
		.pipe(stylus())
		.pipe(autoprefixer())
		.pipe(combineMq())
		.pipe(rename('main.css'))
		.pipe(gulp.dest('dist/dev'))
		.pipe(browserSync.reload({stream:true}))
})

//compile all styl and autoprefix, and minify
gulp.task('css-prod', () => {
	gulp.src('src/css/config.styl')
		.pipe(stylus())
		.pipe(autoprefixer())
		.pipe(replace(/\.\.\/assets/g, 'assets'))
		.pipe(combineMq())
		.pipe(rename('main.css'))
		.pipe(gulp.dest('.tmp'))
})
