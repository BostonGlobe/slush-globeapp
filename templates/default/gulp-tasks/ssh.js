const gulp = require('gulp')
const fs = require('fs')
const shell = require('shelljs')
const argv = require('yargs').argv
const configPath = `${process.cwd()}/data/config.json`
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const base = '/web/bgapps/html/'
const host = 'shell.boston.com'

gulp.task('ssh-prod', (cb) => {
	const username = argv.u
	const files = argv.html ? <% if(projectType === 'Multipage') { %>'$(ls | grep -v -e assets -e archive.zip)'<% } else { %>'index.html bundle.js'<% } %> : '.'
	const filepath = base + config.path
	const configured = checkConfiguration(username)

	if (configured) {
		const command = `(cd dist/prod; scp -r ${files} ${username}@${host}:${filepath})`
		shell.exec(command, cb)
	} else {
		cb()
	}
})

const checkConfiguration = (username) => {
	if (!config.path) {
		console.log('*** setup ssh-config.js "path" to upload to apps ***')
	}
	if (!username) {
		console.log('*** enter your username with "gulp prod -u username" ***')
	}
	return username && typeof username === 'string' && config.path
}
