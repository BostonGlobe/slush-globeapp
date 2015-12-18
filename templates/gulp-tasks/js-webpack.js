const gulp        = require('gulp');
const rename      = require('gulp-rename');
const browserSync = require('browser-sync');
const webpack     = require('webpack-stream');
const wb          = require('./../node_modules/webpack');

const config = {
	module: {
		loaders: [
			{ test: /\.csv?$/, loader: 'dsv-loader' },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
		]
	}
};

gulp.task('js-dev', function() {
	return gulp.src('src/js/main.js')
		.pipe(webpack(config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist/dev/js'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('js-prod', function() {

	const prod_config = Object.assign({}, config, {

		plugins: [
			new wb.optimize.UglifyJsPlugin(),
			new wb.optimize.OccurenceOrderPlugin(),
			new wb.optimize.DedupePlugin()
		]

	});

	return gulp.src('src/js/main.js')
		.pipe(webpack(prod_config))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('.tmp/js'))
});

