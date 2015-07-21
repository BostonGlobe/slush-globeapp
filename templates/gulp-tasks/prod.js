var gulp = require('gulp');
var runSequence = require('run-sequence');

// run all prod tasks to deploy
gulp.task('prod', function(cb) {
	runTasks(function() {
		setTimeout(function() {
			runSequence(
				'ssh-prod',
				cb
			);
		}, 100);
	});
});

function runTasks(cb) {
	runSequence(
		'clean-prod',
		'html-prod',
	 	'css-prod',
		'js-prod',
		'smoosh-prod',
		'assets-prod',
		cb
	);
}