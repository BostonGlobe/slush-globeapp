import FontFaceObserver from 'fontfaceobserver'

export default function(args) {
	const sheet = createStylesheet()

	var handleError = function(err) { console.err(err); }
	var el = document.documentElement;

	args.forEach(font => {
		const fontObserver = new FontFaceObserver(`${font.family}`, { weight: font.weight });
		fontObserver.check().then(function() { addFontRule(sheet, font) }).catch(handleError);
	})
	
}

function createStylesheet() {
	const style = document.createElement('style')
	document.head.appendChild(style)
	return style.sheet
}

function addFontRule(sheet, font) {
	const rule = `
		.${font.family.toLowerCase()}-${font.suffix} {
			font-family: '${font.family}';
			font-weight: ${font.weight};
		}
	`.trim()
	sheet.insertRule(rule, 0)
}