const gulp        = require('gulp');
const shell       = require('shelljs');
const argv        = require('yargs').argv;
const configPath  = process.cwd() + '/config.js';
const graphicPath = require(configPath).path;
const base        = '/web/bgapps/html/graphics/';
const host        = 'shell.boston.com';

gulp.task('ssh-prod', function(cb) {
	const username = argv.u;
	const files = argv.html ? 'index.html' : '.';
	const filepath = base + graphicPath;
	const configured = checkConfiguration(username);

	let command = '';

	if (configured) {
		command = '(cd dist/prod; scp -r ' + files + ' ' + username + '@' + host + ':' + filepath + ')';
		console.log(command);
		shell.exec(command, cb);
	} else {
		cb();
	}
});

const checkConfiguration = function(username) {
	if (!graphicPath) {
		console.log('*** setup ssh-config.js "path" to upload to apps ***');
	}
	if (!username) {
		console.log('*** enter your username with "gulp prod -u username" ***');
	}
	return username && typeof username === 'string' && graphicPath;
};
