var gulp = require('gulp');
var shell = require('shelljs');
var argv = require('yargs').argv;

var configPath = process.cwd() + '/config.js';
var graphicPath = require(configPath).path;
var base = '/web/bgapps/html/graphics/';
var host = 'shell.boston.com';

gulp.task('ssh-prod', function(cb) {
	var username = argv.u;
	var files = argv.html ? 'index.html' : '.';
	var filepath = base + graphicPath;
	var configured = checkConfiguration(username);

	if (configured) { 
		var command = '(cd dist/prod; scp -r ' + files + ' ' + username + '@' + host + ':' + filepath + ')';
		console.log(command);
		shell.exec(command, cb);
	} else {
		cb();
	}
});

var checkConfiguration = function(username) { 
	if (!graphicPath) {
		console.log('*** setup ssh-config.js "path" to upload to apps ***');
	}
	if (!username) {
		console.log('*** enter your username with "gulp prod -u username" ***');	
	}
	return username && typeof username === 'string' && graphicPath;
};