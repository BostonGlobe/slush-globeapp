import loadJS from '../misc/loadJS.js';
import meta from '../../../../data/meta';

const omniture = {
	load: function(cb) {
		loadJS('https://apps.bostonglobe.com/common/js/omniture/s_code_bgcom.27.5.js', cb);
	},

	setupTracking: function(showPaywall) {
		s.pageName = `${meta.section} | ${meta.title}`;
		s.channel = meta.section;
		s.prop1 = `${meta.section} | Specials`;
		s.prop6 = 'Infographic';
		s.prop41 = s.eVar41='BostonGlobe.com';
		s.eVar20 = methode.subscribed ? 'logged in' : 'logged out';
		s.prop35 = methode.subscribed ? 'logged in' : 'logged out';
		s.prop3 = meta.author;
		s.prop67 = meta.page_id;
		s.eVar67 = meta.page_id;

		if(methode && methode.freeviewCountIncremented) {
			s.prop48 = methode.freeviewCount;
		}

		// PAYWALL
		if (showPaywall) {
			s.channel = 'Member Center';
			s.prop1 = 'Member Center | BGC Registration';
			if (window.innerWidth <= 768) {
				// assume mobile
				s.pageName = 'Member Center | BGC Registration | Fullpage Paywall Challenge';
				s.prop6 = 'BGC Registration Page - Fullpage';
			} else {
				// assume desktop
				s.pageName = 'Member Center | BGC Registration | Modal Paywall Challenge';
				s.prop6 = 'BGC Registration Page - Modal';
			}
		}

		// this does something
		s_code=s.t();
		if (s_code) {
			document.write(s_code);
		}
	}
};

export default omniture;
