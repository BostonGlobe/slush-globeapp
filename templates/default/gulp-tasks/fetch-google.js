const gulp = require('gulp')
const archieml = require('archieml')
const request = require('request')
const fs = require('fs')
const configPath = `${process.cwd()}/data/config.json`
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const google = config.copy.google

// GOOGLE DOC ID GOES HERE
const url = `https://docs.google.com/document/d/${google.id}/export?format=txt`

//clear all dev folders and sass cache
gulp.task('fetch-google', (cb) => {
	if (google.id) {
		request(url, function(error, response, body) {
			const parsed = archieml.load(body)
			const str = JSON.stringify(parsed)
			const file = `data/${(google.filename || 'copy')}.json`

			fs.writeFile(file, str, function(err) {
				if (err) console.error(err)
				cb()
			})
		})
	} else {
		console.error('No google doc')
		cb()
	}
})
