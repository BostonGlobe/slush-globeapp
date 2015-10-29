var gulp = require('gulp');
var runSequence = require('run-sequence');

// Default task to be run with `gulp`
gulp.task('default', ['dev'], function() {
	gulp.watch('src/css/**/*.styl', ['css-dev']);
	gulp.watch('src/data/*.json', ['html-dev']);
	gulp.watch('src/html/**/*.hbs', ['html-dev']);
	gulp.watch('src/js/**/*.js', ['js-dev']);
	gulp.watch('src/assets/**/*', ['assets-dev']);
	gulp.watch('dist/dev/index.html', ['browser-sync-reload']);
});

gulp.task('dev', function() {
	runSequence(
		'css-dev',
		'js-dev',
		'assets-dev',
		'html-dev',
		'browser-sync'
	);
});
