var gulp = require('gulp');
var shell = require('shelljs');

var configPath = process.cwd() + '/config.js';
var config = require(configPath).deploy.ssh;

var command = '(cd dist/prod; scp -rpC . ' + config.username + '@' + config.host + ':' + config.filepath + ')';

gulp.task('ssh-prod', function(cb) {
	if (configured()) {
		shell.exec(command);
	} else {
		console.log('*** setup ssh-config.js to automatically upload to apps ***');
	}

	cb();
});

function configured() {
	return config.username && config.filepath && config.filepath !== '/web/bgapps/html/graphics/';
}
