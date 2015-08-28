var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('zip-prod', function() {
	return gulp.src('dist/dev/**/*')
        .pipe(zip('archive.zip'))
        .pipe(gulp.dest('dist/prod'));
});
