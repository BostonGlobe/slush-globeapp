import omniture from './utils/analytics/omniture'
import chartbeat from './utils/analytics/chartbeat'
import meter from './utils/business/meter'
import socialConnect from './utils/business/socialConnect'
import showPaywall from './utils/business/showPaywall'
import toggleClass from './utils/misc/toggleClass'

import meta from '../../data/meta'

const loaded = { omniture: false, meter: false, 'socialConnect': false }

function triggerPaywall() {

	if (meta.paywall && window.methode.freeviewCount > 5) showPaywall()

}

function checkLoaded(name) {

	loaded[name] = true
		
	if(loaded.omniture && loaded.meter && loaded.socialConnect) {

		// check if we need to show paywall
		triggerPaywall()

		// start tracking all the things
		omniture.setupTracking(meta.paywall && methode.freeviewCount > 5)
		
		// check if we need to show social signon
		socialConnect.setup()

		// toggle subscribe button and share tools based on sub or not
		// const selector = methode.subscribed ? '.g-header--social-list' : '.subscribe-header'
		// const el = document.querySelector(selector)
		// console.log(selector, el)
		// toggleClass.remove(el, 'hide')

	}

}

function init() {

	if (!window.location.hostname.indexOf('localhost') === 0) {

		// tell chartbeat to do its thing
		chartbeat()

		// load omniture lib
		omniture.load(() => checkLoaded('omniture'))

		// load meter lib
		meter(() => checkLoaded('meter'))

		// load fb lib
		socialConnect.load(() => checkLoaded('socialConnect'));

	}

}

init()
