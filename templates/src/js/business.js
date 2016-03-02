import omniture from './utils/analytics/omniture'
import chartbeat from './utils/analytics/chartbeat'
import meter from './utils/paywall/meter'
import showPaywall from './utils/paywall/showPaywall'

import meta from '../../data/meta'

const loaded = {omniture: false, meter: false}

const triggerPaywall = function() {
	if (meta.paywall && window.methode.freeviewCount > 5) {
		showPaywall()
	}
}

const checkOmnitureAndMeterLoad = function(name) {
	loaded[name] = true
	if (loaded.omniture && loaded.meter) {
		omniture.setupTracking(meta.paywall && window.methode.freeviewCount > 5)
		triggerPaywall()
	}
}

const init = function() {
	if (!window.location.hostname.startsWith('localhost')) {

		chartbeat()

		omniture.load(() => checkOmnitureAndMeterLoad('omniture'))

		meter(() => checkOmnitureAndMeterLoad('meter'))
	}
}

init()
