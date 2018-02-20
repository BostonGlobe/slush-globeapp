const gulp = require('gulp')
const runSequence = require('run-sequence')
const args = require('yargs').argv
const taskToRun = args.prod ? ['serve-prod'] : ['dev']

// Default task to be run with `gulp`
gulp.task('default', taskToRun, () => {
  gulp.watch('src/css/**/*.styl', ['css-dev'])
  gulp.watch('data/*.json', ['html-dev'])
  gulp.watch('src/html/**/*.hbs', ['html-dev'])
  gulp.watch('src/js/**/*.js', ['js-dev', 'js-dev-critical'])
  gulp.watch('src/assets/**/*', ['assets-dev'])
  gulp.watch('dist/dev/**/index.html', ['browser-sync-reload'])
})

gulp.task('dev', () => {
  runSequence(
    'clean-dev',
    'css-dev',
    'js-dev',
    'js-dev-critical',
    'assets-dev',
    'html-dev',
    'browser-sync'
  )
})

gulp.task('serve-prod', () => {
  runSequence(
    'clean-prod',
    'html-prod',
    'css-prod',
    'js-prod',
    'js-prod-critical',
    'smoosh-prod',
    'minify-prod',
    'assets-prod',
    'browser-sync'
  )
})