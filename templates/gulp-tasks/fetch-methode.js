const gulp 			= require('gulp')
const fs 			= require('fs')
const request 		= require('request')
const configPath	= process.cwd() + '/data/config.json'
const config     	= JSON.parse(fs.readFileSync(configPath, 'utf8'))
const methode 		= config.copy.methode

const baseUrl = 'http://sports2.devedit.bostonglobe.com/precursor/story/'

const createContentMarkup = (item) => {
	const types = {
		p: ({ content }) => {
			return `<p class='methode-graf'>${content}</p>`
		},
		image: ({ href, credit, caption, alt }) => {
			return `<img src=${href} alt=${alt} />`
		},
		ad: () => {
			return `<div class='ad'></div>`
		},
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

const fetchMethode = (cb) => {
	const promises = methode.story.map(story =>
		new Promise((resolve, reject) =>
			request(`${baseUrl}${story.loid}`, (error, response, body) => {
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
			cb()
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
