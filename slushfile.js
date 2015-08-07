'use strict';

var gulp        = require('gulp');
var inquirer    = require('inquirer');
var runSequence = require('run-sequence');
var shell       = require('shelljs');
var request     = require('request');
var fs          = require('fs');
var moment      = require('moment');
var s           = require('underscore.string');


function getGraphicName() {
	return [moment().format('YYYY-MM-DD'), s.slugify(shell.pwd().split('/').slice(-1)[0])].join('_');
}

function initGitRepo() {
	shell.exec('git init');
	shell.exec('git add .');
	shell.exec('git commit -m "first commit"');
}

function pushGitRepo() {
	shell.exec('git push -u origin master');
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
					message: 'Add webpack?'
				}
			], function(answers){

				var files = [
					'gulp-tasks/js-webpack.js',
					'src/js/main-webpack.js',
					'src/html/partials/base/base-js-webpack.hbs'
				];

				if (answers.webpack){

					files.forEach(function(f){
						shell.mv('-f', f, f.replace('-webpack', ''))
					});

				} else {

					shell.rm('-f', files);

				}

				done();
			});

		});
});

gulp.task('add-to-git-repo', function(done) {

	var hasHub = shell.which('hub');
	var choices = ['None', 'Bitbucket'];
	if (hasHub) {
		choices.push('GitHub');
	}

	inquirer.prompt([
		{
			type: 'list',
			name: 'git',
			message: 'Add ' + getGraphicName() + ' to git repository?',
			choices: choices
		}
	], function(answers) {

		switch(answers.git) {

			case 'None':
				done();
			break;
			case 'Bitbucket':
				inquirer.prompt([
					{
						type: 'input',
						name: 'username',
						message: 'Enter your Bitbucket username'
					},
					{
						type: 'password',
						name: 'password',
						message: 'Enter your Bitbucket password'
					}
				], function(innerAnswers) {

					initGitRepo();
					shell.exec("curl --user " + innerAnswers.username + ":" + innerAnswers.password + " https://api.bitbucket.org/1.0/repositories/ --data name=" + getGraphicName() + " --data is_private='true'");
					shell.exec("git remote add origin https://" + innerAnswers.username + "@bitbucket.org/" + innerAnswers.username + "/" + getGraphicName() + ".git");
					pushGitRepo();
					done();
				});
			break;
			case 'GitHub':
				initGitRepo();
				shell.exec('hub create BostonGlobe/' + getGraphicName() + ' -p');
				pushGitRepo();
				done();
			break;
		}

	});
});

gulp.task('setup-ssh', function(done) {
	inquirer.prompt([
		{
			type: 'input',
			name: 'username',
			message: 'Enter your shell username'
		},
		{
			type: 'input',
			name: 'filepath',
			message: 'Enter the path to your app [year]/[month]/[name]'
		}],
		function(answers) {
			shell.sed('-i', '||USERNAME||', answers.username, 'ssh-config.js');
			shell.sed('-i', '||PATH-TO-APP||', answers.filepath, 'ssh-config.js');
			done();
		});
});

gulp.task('default', function(done) {
	runSequence(
		'copy-templates-directory',
		'add-to-git-repo',
		'setup-ssh',
		done
	);
});
