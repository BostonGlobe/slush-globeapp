var gulp = require('gulp');
var shell = require('shelljs');
var argv = require('yargs').argv;

var configPath = process.cwd() + '/config.js';
var config = require(configPath).deploy.ssh;

var files = argv.html ? 'index.html' : '.';
var command = '(cd dist/prod; scp -r ' + files + ' ' + config.username + '@' + config.host + ':' + config.filepath + ')';

gulp.task('ssh-prod', function(cb) {
	if (configured()) {
		shell.exec(command, function(code, output) {
			cb();
		});
	} else {
		console.log('*** setup ssh-config.js to automatically upload to apps ***');
		cb();
	}
});

function configured() {
	return config.username && config.filepath && config.filepath !== '/web/bgapps/html/graphics/' && config.filepath.indexOf('/web/bgapps/html/') > -1;
}
