import isMobile from './isMobile'

// Inspired by: https://gist.github.com/rcmachado/7303143 and http://mvartan.com/2014/12/20/fixing-sticky-hover-on-mobile-devices/

export default function removeMobileHover() {
	if (isMobile.any()) {
		// Loop through each stylesheet
		for (let sheetI = document.styleSheets.length - 1; sheetI >= 0; sheetI--) {
			const sheet = document.styleSheets[sheetI]

			// Verify if cssRules exists in sheet
			if (sheet.cssRules) {
				// Loop through each rule in sheet
				for (let ruleI = sheet.cssRules.length - 1; ruleI >= 0; ruleI--) {
					const rule = sheet.cssRules[ruleI]

					// Verify rule has selector text
					if (rule.selectorText) {
						// Replace hover psuedo-class with active psuedo-class
						rule.selectorText = rule.selectorText.replace(':hover', ':active')
					}
				}
			}
		}
	}
}
