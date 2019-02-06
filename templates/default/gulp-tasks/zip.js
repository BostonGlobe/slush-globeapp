const gulp = require('gulp')
const zip = require('gulp-zip')

gulp.task('zip-prod', () => {
  return gulp.src('dist/dev/**/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('dist/prod'))
})
