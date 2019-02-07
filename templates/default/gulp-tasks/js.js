const gulp = require('gulp')
const rename = require('gulp-rename')
const browserSync = require('browser-sync')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const plumber = require('gulp-plumber')
const report = require('./report-error.js')
<% if(projectType === 'Multipage') { %>
const es = require('event-stream')
const fs = require('fs')
const metaPath = `${process.cwd()}/data/meta.json`
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
const metaArray = Object.keys(meta).map(page => meta[page])
const js = metaArray.map(metaObject => `src/js/${metaObject.js}`)

const tasks = (env) => {
  return js.length > 0 ? js.map(path => {
    const filename = path.split('/').pop()
    return gulp.src(path)
            .pipe(plumber({ errorHandler: report }))
            .pipe(webpackStream(config))
            .pipe(rename(filename))
            .pipe(gulp.dest(`dist/${env}`))
  }) : []
}
<% } %>

const config = {
  module: {
    rules: [
      {
        test: /\.csv?$/,
        use: ['dsv-loader']
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/, /gulp-tasks/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env'] // Default to CommonJS because we need to support IE11
              ]
            }
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnError: true
            }
          }
        ]
      }
    ]
  }
}

const prod_config = Object.assign({}, config, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
})

gulp.task('js-dev', () => {
  return <% if(projectType === 'Multipage') { %>es.merge(
  <% } %>gulp.src('src/js/app.js')
    .pipe(plumber({ errorHandler: report }))
    .pipe(webpackStream(config))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('dist/dev'))
    <% if(projectType === 'Multipage') { %>,
    ...tasks('dev')
    )<% } %>
  .pipe(browserSync.reload({ stream: true }))
})

gulp.task('js-dev-critical', () => {
  return gulp.src('src/js/critical.js')
    .pipe(plumber({ errorHandler: report }))
    .pipe(webpackStream(config))
    .pipe(rename('critical.js'))
    .pipe(gulp.dest('dist/dev'))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('js-prod', () => {
  return <% if(projectType === 'Multipage') { %>es.merge(
  <% } %>gulp.src('src/js/app.js')
    .pipe(webpackStream(prod_config))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('dist/prod'))<% if(projectType === 'Multipage') { %>,
    ...tasks('prod')
    )<% } %>
})

gulp.task('js-prod-critical', () => {
  return gulp.src('src/js/critical.js')
    .pipe(webpackStream(prod_config))
    .pipe(rename('critical.js'))
    .pipe(gulp.dest('.tmp'))
})
