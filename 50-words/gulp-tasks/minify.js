const gulp    = require('gulp');
const htmlmin = require('gulp-htmlmin');

gulp.task('minify-prod', function() {
	return gulp.src('dist/prod/*.html')
		.pipe(htmlmin({minifyJS: true, minifyCSS: true}))
		.pipe(gulp.dest('dist/prod'));
});
