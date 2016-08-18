const gulp = require('gulp')
const fs = require('fs')
const request = require('request')
const jimp = require('jimp')

const configPath = process.cwd() + '/data/config.json'
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const methode = config.copy.methode
const imageSizes = [ 640, 1280, 1920 ]
const imageDirectory = 'assets/methode/'
let imagesToDownload = []
let firstAdSlotted = false

const getImageDirectory = () => {
	const dir = methode.imageDirectory || ''
	const finalDir = dir ? `${dir}/` : dir
	
}

const createPicturefill = ({ name, extension, caption }) => {
	const srcset = methode.imageLibrary === 'picturefill' ? 'srcset' : 'data-srcset'
	const lazyload = methode.imageLibrary === 'picturefill' ? '' : 'lazyload'
	const defaultSrc = `${imageDirectory}${name}placeholder.${extension}`
	
	const getPath = (sz) => `${imageDirectory}${name}${sz}.${extension}`
	const getSource = (src, mq) => `<source ${srcset}='${src}' media='(min-width:${mq}px)'>`
	const reversed = imageSizes.map(i => i).reverse()

	return `
		<picture>
			<!--[if IE 9]><video style='display: none;'><![endif]-->
			${
				reversed.map((sz, index) => {
					const src = getPath(sz)
					const mq = index < reversed.length - 1
						? Math.floor(reversed[index + 1] / 1.5)
						: 1
					return getSource(src, mq)
				}).join('')
			}
			<!--[if IE 9]></video><![endif]-->
			<img class='${lazyload}' src='${defaultSrc}' ${srcset}='${defaultSrc}' alt='${caption}' />
		</picture>
	`.trim()
}

const createFigureSource = ({ name, extension, caption }) => {

	if (methode.imageLibrary) {
		return createPicturefill({ name, extension, caption })
	}
	// plain old image default
	const src = `${imageDirectory}${name}${imageSizes[imageSizes.length - 1]}.${extension}`
	return `<img src='${src}' alt='${caption}' />`
}

const getImageInfo = (imagePath) => {
	const imageFull = imagePath.substr(imagePath.lastIndexOf('/') + 1)
	const imageSplit = imageFull.split('.')
	const name = `${imageSplit[0]}_apps_w_`
	const extension = imageSplit[1]
	return { name, extension }
}

const replaceMethodeImageSize = ({ imagePath, imageSize }) =>
	imagePath.replace(/image_(.+\d)w/g, `image_${imageSize}w`)

const replaceLocalImageSize = ({ imagePath, imageSize }) =>
	imagePath.replace(/_apps_w_(.+\d)\./g, `_apps_w_${imageSize}.`)

const createFigure = ({ href, credit, caption, alt }) => {
	const imagePath = href.split('?')[0]
	const { name, extension } = getImageInfo(imagePath)

	// start generating markup
	const src = createFigureSource({ name, extension, caption })
	
	// add to download queue
	const imageSize = 1920
	const url = `http:${replaceMethodeImageSize({ imagePath, imageSize })}`
	const filename = `${name}${imageSize}.${extension}`
	
	imagesToDownload.push({ url, filename })

	return `
		<figure>
			${src}
			<small class='figure-credit'>${credit}</small>
			<figcaption class='figure-caption'>${caption}</figcaption>
		</figure>
	`.trim()
}

const cleanP = (content) => {
	// check for graphic partial first
	if (content.match(/{{graphic:(.*)}}/)) {
		return content.replace(/{{graphic:(.*)}}/, (match, name, index) =>
			`{{> graphic/${name.trim()} }}`
		)
	}

	const stripped = content
		.replace(/<span(.*?)>/g, '') // remove spans
		.replace(/<\/span>/g, '')
		.replace(/<b(.*?)>/g, '') // remove bolds
		.replace(/<\/b>/g, '')

	// hr
	if (stripped.match(/(\*.*){3})/)) return '<hr>'
	//subhed
	if (stripped.match(/subhead>/)) {
		return stripped.replace(/<subhead(.*?)>/g, "<h3 class='section-hed miller-banner-regular'>")
		.replace(/<\/subhead>/g, '</h3>')
	}

	return stripped.length ? `<p class='methode-graf'>${stripped}</p>` : ''
}

const createContentMarkup = (item) => {
	const types = {
		p: ({ content }) => cleanP(content),
		image: ({ href, credit, caption, alt }) => createFigure({ href, credit, caption, alt }),
		subhead: ({ content }) => {
			return `<h3 class='section-hed miller-banner-regular'>${content}</h3>`
		},
		ad: () => {
			firstAdSlotted = true
			return `{{> base/base-ad-slot}}`
		},
	}
	
	if (item.type === 'ad' && firstAdSlotted) return ''
	return types[item.type](item)
}

const createHTML = (stories) =>
	stories.map((story, index) => {
		const { content } = story.body
		// go thru item in content and create the proper markup
		return `
			<div class='methode__story methode__story--${index}'>
				${content.map(createContentMarkup).join('\n')}
			</div>
		`
	}).join('')

const writeHTML = (html) =>
	fs.writeFileSync('src/html/partials/graphic/methode.hbs', html)

const resizeImage = ({ path, resolve, reject }) => {
	console.log('resizing image...')
	// create smaller versions of each image
	const promises = imageSizes.map(imageSize =>
		new Promise((res, rej) => {
			const out = replaceLocalImageSize({ imagePath: path, imageSize })
			jimp.read(path).then(image =>
		    	image
		    	.resize(imageSize, jimp.AUTO)
				.write(out, res)
			).catch(err => rej(err))
		})
	)

	promises.push(
		new Promise((res, rej) => {
			const imageSize = 20
			const out = replaceLocalImageSize({ imagePath: path, imageSize: 'placeholder' })
			jimp.read(path).then(image =>
		    	image
		    	.blur(40)
		    	.resize(imageSize, jimp.AUTO)
				.write(out, res)
			).catch(err => rej(err))
		})
	)
	
	Promise.all(promises)
		.then(result => resolve(result))
		.catch(error => reject(error))
}

const downloadImages = (cb) => {
	const promises = imagesToDownload.map(image => 
		new Promise((resolve, reject) => {
			const { url, filename } = image
			const path = `src/${imageDirectory}${filename}`
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
							else resizeImage({ path, resolve, reject })
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
	const base = 'http://prdedit.bostonglobe.com/eom/SysConfig/WebPortal/BostonGlobe/precursor/template/api_redirect.jsp?path=/'
	const promises = methode.story.map(story =>
		new Promise((resolve, reject) => {
			const url = `${base}${story.path}`
			console.log('fetching story data:', url)
			request(url, (error, response, body) => {
				if (!error && response.statusCode === 200) {
					resolve({...story, body: JSON.parse(body)})
				} else {
					reject(error)
				}
			})
		})
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
