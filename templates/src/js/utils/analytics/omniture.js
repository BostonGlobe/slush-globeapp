import loadJS from '../misc/loadJS.js'
import getMetaContent from '../misc/getMetaContent'

const omniture = {

	load: function(cb) {

		loadJS('https://apps.bostonglobe.com/common/js/omniture/s_code_bgcom.27.5.js', cb)

	},

	setupTracking: function(showPaywall) {

		window.s.pageName = `${getMetaContent('section')} | ${getMetaContent('title')}`
		window.s.channel = getMetaContent('section')
		window.s.prop1 = `${getMetaContent('section')} | Specials`
		window.s.prop6 = 'Infographic'
		window.s.prop41 = window.s.eVar41 = 'BostonGlobe.com'
		window.s.eVar20 = window.methode.subscribed ? 'logged in' : 'logged out'
		window.s.prop35 = window.methode.subscribed ? 'logged in' : 'logged out'
		window.s.prop3 = getMetaContent('author')
		window.s.prop67 = getMetaContent('pageId')
		window.s.eVar67 = getMetaContent('pageId')

		if (window.methode && window.methode.freeviewCountIncremented) {

			window.s.prop48 = window.methode.freeviewCount

		}

		// PAYWALL
		if (showPaywall) {

			window.s.channel = 'Member Center'
			window.s.prop1 = 'Member Center | BGC Registration'
			if (window.innerWidth <= 768) {
				
				// assume mobile
				window.s.pageName = 'Member Center | BGC Registration | Fullpage Paywall Challenge'
				window.s.prop6 = 'BGC Registration Page - Fullpage'

			} else {

				// assume desktop
				window.s.pageName = 'Member Center | BGC Registration | Modal Paywall Challenge'
				window.s.prop6 = 'BGC Registration Page - Modal'

			}

		}

		// this does something
		const s_code = window.s.t()
		if (s_code) {

			document.write(s_code)

		}

	}

}

export default omniture
