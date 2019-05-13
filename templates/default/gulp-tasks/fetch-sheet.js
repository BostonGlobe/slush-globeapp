const gulp = require('gulp')
const gulpSheets = require('google-spreadsheet-to-json')
const fs = require('fs')
const configPath = `${process.cwd()}/data/config.json`
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const google = config.copy.google
const file = `data/${google.sheet.fileName}.json`
const _ = require('lodash')
const typogr = require('typogr')

// Helpful groupBy function
const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key]
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
    return objectsByKeyValue
  }, {})

// Function for smart quotes. Modify it for your needs.
const smarty = (obj) => {
  Object.keys(obj).forEach(k => {
    if (typeof obj[k] !== 'undefined' && typeof obj[k] === 'string') {
      obj[k] = typogr.smartypants(obj[k].trim())
    }
  })
  return obj
}

gulp.task('fetch-sheet', (cb) => {
  if (google.sheet) {
    gulpSheets({
      spreadsheetId: `${google.sheet.id}`,
      // worksheet: [0, 1, 2, 3, 4, 5, 6, 7, 8] If multiple sheets
    })
    .then((result) => {
      // Smartify your result
      result = result.map(d => smarty(d))

      let final = { 'data': result }
      const str = JSON.stringify(final)

      // Write roster.json file
      fs.writeFile(file, str, function(error) {
        if (error) console.error(error)
        cb()
      })
    })
    .catch((err) => {
      console.log(err.message)
      console.log(err.stack)
    })
  } else {
    console.error('No google sheet found')
    cb()
  }
})
