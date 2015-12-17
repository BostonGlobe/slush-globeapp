const gulp    = require('gulp');
const htmlmin = require('gulp-htmlmin');

gulp.task('minify-html', function() {
	return gulp.src('dist/prod/*.html')
		.pipe(htmlmin({minifyJS: true}))
		.pipe(gulp.dest('dist/prod'));
});
