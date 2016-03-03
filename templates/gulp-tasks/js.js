const gulp          = require('gulp');
const rename        = require('gulp-rename');
const browserSync   = require('browser-sync');
const webpackStream = require('webpack-stream');
const webpack       = require('webpack');
const plumber		= require('gulp-plumber');
const report 		= require('../report-error.js');

const config = {
	module: {
		loaders: [
			{ test: /\.csv?$/, loader: 'dsv-loader' },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
		]
	}
};

const prod_config = Object.assign({}, config, {
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin()
	]
});

gulp.task('js-dev', function() {
	return gulp.src('src/js/app.js')
		.pipe(plumber({ errorHandler: report }))
		.pipe(webpackStream(config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist/dev/js'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('js-prod', function() {
	return gulp.src('src/js/app.js')
		.pipe(webpackStream(prod_config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist/prod/js'))
});