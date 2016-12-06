const yarn        = require('gulp-yarn')
const gulp        = require('gulp')
const inquirer    = require('inquirer')
const runSequence = require('run-sequence')
const shell       = require('shelljs')
const s           = require('underscore.string')
const pkg         = require('./package.json')

function getGraphicName() {
	return s.slugify(shell.pwd().split('/').slice(-1)[0])
}

gulp.task('copy', function() {

	return gulp.src(__dirname + '/templates/**', {dot: true})
		.pipe(gulp.dest('./'))

})

gulp.task('install', function() {

	return gulp.src('./package.json')
		.pipe(yarn())

})

gulp.task('setup-ssh', function(done) {

	inquirer.prompt([
		{
			type: 'list',
			name: 'section',
			message: 'Select a section',
			choices: [
				'arts',
				'business',
				'lifestyle',
				'magazine',
				'metro',
				'news/nation',
				'news/politics',
				'news/world',
				'opinion/ideas',
				'sports',
			]
		}
	]).then(function(answers) {

		const now = new Date()
		const year = now.getFullYear()
		const month = now.getMonth() + 1
		const url = `${answers.section}/graphics/${year}/${month}/${getGraphicName()}`

		console.log('Setting app url to /' + url)

		// ad correct path to config.json
		shell.sed('-i', '||PATH-TO-APP||', url, 'data/config.json')

		// add correct year to LICENSE
		shell.sed('-i', '||YEAR||', year, 'LICENSE')

		// add correct graphic name to README
		shell.sed('-i', /APPNAME/g, getGraphicName(), 'README.md')

		done()

	})

})

gulp.task('check-for-updates', function(done) {

	const latestVersion = shell.exec('npm view slush-globeapp version', {silent:true}).output.split('\n')[0]
	const installedVersion = pkg.version

	if (latestVersion !== installedVersion) {
		console.log('Your version of slush-globeapp is outdated. Please update and try again.')
		shell.exit(1)
	} else {
		done()
	}

})

gulp.task('default', function(done) {

	runSequence(
		'check-for-updates',
		'copy',
		'install',
		'setup-ssh',
		done
	)
})
