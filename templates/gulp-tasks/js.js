var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

var config = {
	module: {
		loaders: [
			{ test: /\.csv?$/, loader: 'dsv-loader' },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel'}
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
	return gulp.src('src/js/main.js')
		.pipe(webpack(config))
		.pipe(uglify())
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('.tmp/js'))
});

