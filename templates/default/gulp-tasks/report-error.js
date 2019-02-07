'use strict';

const notify = require('gulp-notify')
const shell = require('shelljs')
const chalk = require('chalk')
const beep = require('beep')

module.exports = function(error) {
  const lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : ''
  const name = shell.exec('whoami', {silent:true}).stdout

  notify({
    title: 'Task failed [' + error.plugin + ']',
    subtitle: 'Goddamnit, ' + name,
    message: lineNumber + 'See terminal.',
    icon: 'https://apps.bostonglobe.com/common/img/disapproving.png',
    sound: 'Sosumi'
  }).write(error)

  beeper()

  let report = `
    TASK: ${ error.plugin }
    PROB: ${ error.message }
    `

  if (error.lineNumber) {
    report += 'LINE:' + ' ' + error.lineNumber + '\n'
  }

  if (error.fileName) {
    report += 'FILE:' + ' ' + error.fileName + '\n'
  }

  console.error(chalk.white.bgRed(report))

  this.emit('end')
}
