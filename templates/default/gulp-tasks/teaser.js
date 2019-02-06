const gulp = require('gulp')
const request = require('request')
const fs = require('fs')
const cheerio = require('cheerio')

gulp.task('fetch-teaser', (cb) => {
  const metaFile = 'data/meta.json'

  fs.readFile(metaFile, (err, data) => {
    const urls = JSON.parse(data)<% if(projectType === 'Multipage') { %>.index<% } %>.teasers
    if (urls.length) fetchAllTeasers(urls, cb)
    else cb()
  })
})

const fetchAllTeasers = (urls, cb) => {
  const data = []
  const fetchNext = (index) => {
    fetchTeaser(urls[index], (err, datum) => {
      index++
      if (!err && datum) data.push(datum)

      if (index < urls.length) fetchNext(index)
      else writeData(data, cb)
    })
  }
  fetchNext(0)
}

const fetchTeaser = (url, cb) => {
  request(url, (err, response, body) => {
    if (!err && response.statusCode == 200) {
      const $ = cheerio.load(body)
      const titleRaw = $('title').first().text()
      const title = titleRaw.split('- The Boston Globe')[0].trim()
      const datum = { url, title }

      const meta = $('meta')
      meta.each(function(i, el) {
        if(el.attribs.property && el.attribs.property === 'og:image') {
          const imageRaw = el.attribs.content
          const imageHttps = imageRaw.replace('http://', 'https://')
          const image = imageHttps.replace('image_585w', 'image_960w')
          datum.image = image
        }
      })
      cb(null, datum)
    }
    else cb(true)
  })
}

const writeData = (data, cb) => {
  const teaserFile = 'data/teasers.json'
  const str = JSON.stringify(data)

  fs.writeFile(teaserFile, str, (err) => {
    if (err) console.log(err)
    cb()
  })
}
