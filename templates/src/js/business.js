import omniture from './utils/analytics/omniture';
import chartbeat from './utils/analytics/chartbeat';
import meter from './utils/paywall/meter';
import showPaywall from './utils/paywall/showPaywall';

import meta from '../../data/meta';

const loaded = {'omniture': false, 'meter': false};

const init = function() {
	if (!window.location.hostname.startsWith('localhost')) {
		
		chartbeat();

		omniture.load( () => checkOmnitureAndMeterLoad('omniture') );

		meter( () => checkOmnitureAndMeterLoad('meter') );
	}
};

const triggerPaywall = function() {
	if (meta.paywall && methode.freeviewCount > 5) {
		showPaywall();
	}
};

// set tracking codes for omniture and decide if we show paywall
const checkOmnitureAndMeterLoad = function(name) {
	loaded[name] = true;
	if(loaded['omniture'] && loaded['meter']) {
		omniture.setupTracking(meta.paywall && methode.freeviewCount > 5);
		triggerPaywall();
	}
};

init();
