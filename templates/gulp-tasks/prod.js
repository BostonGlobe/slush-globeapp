const gulp = require('gulp')
const runSequence = require('run-sequence')

const runTasks = (cb) => {
	runSequence(
		'clean-prod',
		'html-prod',
		'css-prod',
		'js-prod',
		'smoosh-prod',
		'minify-prod',
		'assets-prod',
		'zip-prod',
		'chmod-prod',
		cb
	)
}

// run all prod tasks to deploy
gulp.task('prod', (cb) => {
	runTasks(() => {
		setTimeout(() => {
			runSequence(
				'ssh-prod',
				cb
			)
		}, 100)
	})
})
