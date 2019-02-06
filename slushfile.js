const yarn        = require('gulp-yarn')
const gulp        = require('gulp')
const template    = require('gulp-template')
const inquirer    = require('inquirer')
const runSequence = require('run-sequence')
const shell       = require('shelljs')
const s           = require('underscore.string')
const pkg         = require('./package.json')

// http://stackoverflow.com/a/196991/64372
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

function getGraphicName() {
  return s.slugify(shell.pwd().split('/').slice(-1)[0])
}

gulp.task('copy', function(done) {
  const log = (err) => {
    console.log(err);
  }
  inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'Select a project type',
      choices: [
        'Default',
        'Multipage'
      ],
      default: 'Default'
    },
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
        'opinion',
        'sports',
      ]
    }
  ]).then(function(answers) {
    const srcdirs = answers.projectType === 'Multipage' ? [
      __dirname + '/templates/default/**',
      __dirname + '/templates/multipage/**'
    ] : __dirname + '/templates/default/**'
    const now = new Date()
    const year = now.getFullYear()
    const month = ((now.getMonth() + 1) < 10 ? '0' : '') + (now.getMonth() + 1)
    const section = answers.section
    const sectionTitled = toTitleCase(section.split('/').slice(-1)[0])
    const url = `${section}/graphics/${year}/${month}/${getGraphicName()}`
    const sectionUrl = `https://www.bostonglobe.com/${section}`

    answers.pathToApp = url
    answers.path = `https://apps.bostonglobe.com/${url}`
    answers.appName = getGraphicName()
    answers.sectionTitled = sectionTitled
    answers.sectionUrl = sectionUrl
    answers.year = year

    return gulp.src(srcdirs, {dot: true})
      .pipe(template(answers, { interpolate: /\${{{([\s\S]+?)}}}\$/g }))
      .pipe(gulp.dest('./'))
      .on('end', done)
  }).catch(err => { console.log(err); })
})

gulp.task('install', function() {
  return gulp.src('./package.json')
    .pipe(yarn())
})

gulp.task('check-for-updates', function(done) {
  const latestVersion = shell.exec('npm view slush-globeapp version', {silent:true}).stdout.split('\n')[0]
  const installedVersion = pkg.version

  if (latestVersion !== installedVersion) {
    console.log('Your version of slush-globeapp is outdated. Please update and try again.')
    shell.exit(1)
  } else {
    console.log('Using version ' + installedVersion)
    done()
  }

})

gulp.task('default', function(done) {
  runSequence(
    'check-for-updates',
    'copy',
    'install',
    done
  )
})
