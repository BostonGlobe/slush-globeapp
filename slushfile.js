const gulp        = require('gulp');
const inquirer    = require('inquirer');
const runSequence = require('run-sequence');
const shell       = require('shelljs');
const request     = require('request');
const fs          = require('fs');
const moment      = require('moment');
const s           = require('underscore.string');
const pkg         = require('./package.json');

function getGraphicName() {
	return [moment().format('YYYY-MM-DD'), s.slugify(shell.pwd().split('/').slice(-1)[0])].join('_');
}

gulp.task('copy-templates-directory', function(done) {

	// make user feel at ease
	console.log('*** Scaffolding app. Take a deep breath. ***');

	gulp.src(__dirname + '/templates/**', {dot: true})
		.pipe(gulp.dest('./'))
		.on('finish', function() {

			// unzip node modules
			shell.exec('unzip -q node_modules.zip');
			shell.exec('rm -rf node_modules.zip');

			// add correct year to LICENSE
			shell.sed('-i', '||YEAR||', new Date().getFullYear(), 'LICENSE');

			// add correct graphic name to README
			shell.sed('-i', /APPNAME/g, getGraphicName(), 'README.md');

			// add webpack
			inquirer.prompt([
				{
					type: 'confirm',
					name: 'webpack',
					message: 'Add webpack?',
					default: false
				}
			], function(answers) {

				const files = [
					'gulp-tasks/js-webpack.js',
					'src/js/main-webpack.js',
					'src/html/partials/base/base-js-webpack.hbs'
				];

				if (answers.webpack) {

					files.forEach(function(f) {
						shell.mv('-f', f, f.replace('-webpack', ''));
					});

				} else {

					shell.rm('-f', files);

				}

				done();
			});

		});
});

gulp.task('setup-ssh', function(done) {
	inquirer.prompt([
		{
			type: 'input',
			name: 'path',
			message: 'Enter the path to your app [year]/[month]/[graphic-name]'
		}],
		function(answers) {
			shell.sed('-i', '||PATH-TO-APP||', answers.path, 'config.js');
			done();
		});
});

gulp.task('check-for-updates', function(done) {

	const latestVersion = shell.exec('npm view slush-globeapp version', {silent:true}).output.split('\n')[0];
	const installedVersion = pkg.version;

	if (latestVersion !== installedVersion) {

		console.log('Your version of slush-globeapp is outdated. Please update and try again.');
		shell.exit(1);

	} else{

		done();
	}

});

gulp.task('default', function(done) {

	runSequence(
		'check-for-updates',
		'copy-templates-directory',
		'setup-ssh',
		done
	);
});
