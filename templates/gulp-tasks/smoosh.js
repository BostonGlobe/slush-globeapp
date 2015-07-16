var gulp = require('gulp');
var smoosher = require('gulp-smoosher');
var chmod = require('gulp-chmod');

//smoosh all the files! (insert code for references/links to resources)
gulp.task('smoosh-prod', function() {
    gulp.src('.tmp/*.html')
        .pipe(smoosher())
        .pipe(chmod(664))
        .pipe(gulp.dest('dist/prod'));
});