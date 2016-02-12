const gulp 			= require('gulp');
const changed 		= require('gulp-changed');
const browserSync   = require('browser-sync');
const src     		= 'src/assets/**/*';

gulp.task('assets-dev', function() {
	return gulp.src(src)
		.pipe(changed('dist/dev/assets'))
		.pipe(gulp.dest('dist/dev/assets'))
		.pipe(browserSync.reload({stream:true}));
});

// move assets files to prod folder
gulp.task('assets-prod', function() {
	return gulp.src(src)
		.pipe(changed('dist/prod/assets'))
		.pipe(gulp.dest('dist/prod/assets'));
});
