const gulp     = require('gulp');
const smoosher = require('gulp-smoosher');
const useref   = require('gulp-useref');
const gulpif   = require('gulp-if');
const uglify   = require('gulp-uglify');
const eol      = require('gulp-eol');

//smoosh all the files! (insert code for references/links to resources)
gulp.task('smoosh-prod', function() {
	gulp.src('.tmp/*.html')
		.pipe(smoosher())
		.pipe(gulp.dest('dist/prod'));
});

gulp.task('uglify-external-js-prod', function() {
	return gulp.src('.tmp/*.html')
		.pipe(eol())
		.pipe(useref({ searchPath: './src/' }))
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulp.dest('.tmp'));
});
