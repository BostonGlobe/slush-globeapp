const fs = require('fs')
const _ = require('lodash')

const configPath = process.cwd() + '/data/config.json'
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const metaPath = process.cwd() + '/data/meta.json'
const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
const metaArray = Object.keys(meta).map(page => meta[page])
const pages = metaArray.filter(metaItem => typeof metaItem.page !== 'undefined').map(metaItem => metaItem.page)
const ordered = pages.filter(page => typeof page.order !== 'undefined').sort((pageA, pageB) => pageA.order - pageB.order)
const unordered = pages.filter(page => typeof page.order === 'undefined')
const combined = ordered.concat(unordered)

const getLink = (link) => {
  const img = link.imgPath ?
    `<img class='recirc__img' aria-hidden='true' src='/${config.path}/${link.imgPath}' alt='' />`: null
  return `
    ${img}
    <div class='recirc__content'>
      <p class='recirc__overline benton-regular'>More from <b class='benton-bold'>${meta.index.title}</b> series</p>
      <a href='/${config.path}/${link.path}?p1=Refugee_menu' class='recirc__link miller-banner-regular'>${link.text}</a>
    </div>
  `
}

module.exports = function(pageMeta, opts) {
  let linksArray = []
  // If any meta object is passed to getNav, remove current page from
  // nav array
  if(typeof pageMeta !== 'undefined') {
    // Get index of current page in the sorted array of page objects
    const pageIndex = findIndex(combined, page => page.path === pageMeta.page.path)

    if(pageIndex < 0) {
      // If current page isn't in array then display all sorted links
      linksArray = combined
    } else if(pageIndex > 0) {
      // If index exists in array then slice/splice array so that
      // first item in array is the next ordered page
      // (eg. current story dynamic nav will show the next story - according
      // to order - as the first link and continues from there)
      linksArray = combined.slice(pageIndex + 1)
      if(pageIndex === 1) {
        linksArray.push(combined[0])
      } else {
        linksArray.concat(combined.slice(0, pageIndex - 1))
      }
    } else {
      // If index is 0 (ie the first story) use the all
      // other links after 0 index
      linksArray = combined.slice(1)
    }

    // Create links with every oredered followed by unordered links
    // excluding current page
    linksArray = linksArray.map(getLink)

    return linksArray.join('')
  } else {
    // Create links using all
    linksArray = combined.map(getLink)
    return linksArray.join('')
  }

}
