var gulp = require('gulp');
var changed = require('gulp-changed');
var chmod = require('gulp-chmod');

var src = 'src/assets/**/*';

gulp.task('assets-dev', function() {
	return gulp.src(src)
		.pipe(changed('dist/dev/assets'))
		.pipe(gulp.dest('dist/dev/assets'));
});

// move assets files to prod folder
gulp.task('assets-prod', function() {
	return gulp.src(src)
		.pipe(changed('dist/prod/assets'))
		.pipe(chmod(664))
		.pipe(gulp.dest('dist/prod/assets'));
});