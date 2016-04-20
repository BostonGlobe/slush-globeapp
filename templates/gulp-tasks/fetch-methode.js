const gulp 			= require('gulp')
const fs 			= require('fs')
const request 		= require('request')

const configPath = process.cwd() + '/data/config.json'
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const methode = config.copy.methode
let imagesToDownload = []

const getImageDirectory = () =>
	`assets/${methode.imageDirectory || ''}` 

const createPicturefill = ({ name, extension, caption, imageSizes, imageDirectory }) => {
	const srcset = methode.imageLibrary === 'picturefill' ? 'srcset' : 'data-srcset'
	const lazyload = methode.imageLibrary === 'picturefill' ? '' : 'lazyload'
	const defaultSrc = `${imageDirectory}${name}_${imageSizes[0]}.${extension}`
	
	const getPath = (sz) => `${imageDirectory}${name}_${sz}.${extension}`
	const getSource = (src, mq) => `<source ${srcset}='${src}' media='(min-width:${mq}px)'>`

	return `
		<picture>
			<!--[if IE 9]><video style='display: none;'><![endif]-->
			${
				imageSizes.reverse().map((sz, index) => {
					const src = getPath(sz)
					const mq = index > 0 ? Math.floor(imageSizes[index - 1] / 1.5) : 1
					return getSource(src, mq)
				}).join('')
			}
			<!--[if IE 9]></video><![endif]-->
			<img class='${lazyload}' src='${defaultSrc}' ${srcset}='${defaultSrc}' alt='${caption}' />
		</picture>
	`.trim()
}

const createFigureSource = ({ name, extension, caption, imageSizes }) => {
	const imageDirectory = getImageDirectory()

	if (methode.imageLibrary) {
		return createPicturefill({ name, extension, caption, imageSizes, imageDirectory })
	}
	// plain old image default
	const src = `${imageDirectory}${name}_${imageSizes[0]}.${extension}`
	return `<img src='${src}' alt='${caption}' />`
}

const getImageInfo = (imgPath) => {
	const imgFull = imgPath.substr(imgPath.lastIndexOf('/') + 1)
	const imgSplit = imgFull.split('.')
	const name = imgSplit[0]
	const extension = imgSplit[1]
	return { name, extension }
}

const replaceImageSize = ({ imgPath, imageSize }) =>
	imgPath.replace(/image_(.+\d)w/g, `image_${imageSize}w`)

const createFigure = ({ href, credit, caption, alt }) => {
	const imageSizes = methode.imageSizes || [1200]
	const imgPath = href.split('?')[0]
	const { name, extension } = getImageInfo(imgPath)

	// start generating markup
	const src = createFigureSource({ name, extension, caption, imageSizes })
	
	// add to download queue
	const images = imageSizes.map(imageSize => ({
		url: `http:${replaceImageSize({ imgPath, imageSize })}`,
		filename: `${name}_${imageSize}.${extension}`,
	}))

	imagesToDownload = imagesToDownload.concat(images)

	return `
		<figure>
			${src}
			<small class='figure-credit'>${credit}</small>
			<figcaption class='figure-caption'>${caption}</figcaption>
		</figure>
	`.trim()
}

const cleanP = (content) => {
	const withoutOpenSpan = content.replace(/<span(.*?)>/g, '')
	const withoutCloseSpan = withoutOpenSpan.replace(/<\/span>/g, '')
	return withoutCloseSpan
}

const createContentMarkup = (item) => {
	const types = {
		p: ({ content }) => `<p class='methode-graf'>${cleanP(content)}</p>`,
		image: ({ href, credit, caption, alt }) => createFigure({ href, credit, caption, alt }),
		ad: () => `<div class='ad'></div>`,
	}
	
	return types[item.type](item)
}

const createHTML = (stories) => {
	const html = stories.map(story => {
		const { content } = story.body
		// go thru item in content and create the proper markup
		return content.map(createContentMarkup).join('\n')
	})

	return html.join('\n')
}

const writeHTML = (html) =>
	fs.writeFileSync('src/html/partials/graphic/methode.hbs', html)

const downloadImages = (cb) => {
	const promises = imagesToDownload.map(image => 
		new Promise((resolve, reject) => {
			const { url, filename } = image
			const path = `src/${getImageDirectory()}/${filename}`
			try {
				const exists = fs.lstatSync(path)
				resolve()
			} catch (e) {
				console.log(`downloading: ${url}`)
				request(url, {encoding: 'binary'}, (error, response, body) => {
					if (error) reject(error)
					else {
						fs.writeFile(path, body, 'binary', (err) => {
							if (err) reject(err)
							else resolve()
						})
					}
				})
			}
		})
	)

	Promise.all(promises)
		.then(result => cb())
		.catch(error => {
			console.log(error)
			cb()
		})
}

const fetchMethode = (cb) => {
	const base = 'http://sports2.devedit.bostonglobe.com/precursor/story/'
	const promises = methode.story.map(story =>
		new Promise((resolve, reject) =>
			request(`${base}${story.loid}`, (error, response, body) => {
				if (!error && response.statusCode === 200) {
					resolve({...story, body: JSON.parse(body)})
				} else {
					reject(error)
				}
			})
		)
	)

	Promise.all(promises)
		.then(results => {
			const html = createHTML(results)
			writeHTML(html)
			downloadImages(cb)
		})
		.catch(error => {
			console.error(error)
			cb()
		})
}

gulp.task('fetch-methode', (cb) => {
	if (methode.story.length) fetchMethode(cb)
	else {
		console.error('No methode story in config')
		cb()
	}
})
