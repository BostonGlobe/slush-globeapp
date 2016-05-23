import 'promis'
import FontFaceObserver from 'fontfaceobserver'

const createStylesheet = () => {
	const style = document.createElement('style')
	document.head.appendChild(style)
	return style.sheet
}

const storeFont = font => {
	const name = `${font.family.toLowerCase()}-${font.suffix}`
	localStorage[name] = 'fontLoaded'
}

const addFontRule = ({ font, sheet }) => {
	const rule = `
		.${font.family.toLowerCase()}-${font.suffix} {
			font-family: '${font.family}';
			font-weight: ${font.weight};
		}
	`.trim()
	sheet.insertRule(rule, 0)
}

const handleError = err =>console.error(err)

const loadFont = fonts => {
	const sheet = createStylesheet()
	const el = document.documentElement
	const timeout = 5000

	fonts.forEach(font => {
		// TODO only load if not in cache
		const fontObserver = new FontFaceObserver(`${font.family}`, { weight: font.weight })
		fontObserver.load(null, timeout)
			.then(() => {
				storeFont(font)
				addFontRule({ font, sheet })
			})
			.catch(handleError)
	})
}

export default loadFont
