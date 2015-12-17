(function() {
	var _loaded = {
		'omniture': false,
		'meter': false
	};

	var _showPaywall;

	var chartbeat = function() {
		window._sf_startpt=(new Date()).getTime();
		window._sf_async_config={uid:8544,domain:"bostonglobe.com"};
		_sf_async_config.path = location.pathname;

		// Section and Author tagging
		_sf_async_config.sections = "{{meta.chartbeat_section}}";
		_sf_async_config.authors = "infographic";   //used for page type


		(function(){
			function loadChartbeat() {
				window._sf_endpt=(new Date()).getTime();
				var e = document.createElement('script');
				e.setAttribute('language', 'javascript');
				e.setAttribute('type', 'text/javascript');
				e.setAttribute('src',
					(("https:" == document.location.protocol) ? "https://s3.amazonaws.com/" : "http://") + "static.chartbeat.com/js/chartbeat.js");
				document.body.appendChild(e);
			}
			var oldonload = window.onload;
			window.onload = (typeof window.onload != 'function') ?
				loadChartbeat : function() { oldonload(); loadChartbeat(); };
		})();
	};

	var omniture = function() {
		loadJS('https://apps.bostonglobe.com/common/js/omniture/s_code_bgcom.27.5.js', function() {
			checkLoad('omniture');
		});
	};

	var meter = function() {
		window.methode = {};
		loadJS('https://www.bostonglobe.com/js/metercheck.js', function() {
			var hasPaywall = {{meta.paywall}};
			var registrationWallVal = hasPaywall ? 'non-exempt' : 'exempt';
			window.bglobe.freeviewMeter.init({pageId : '{{meta.page_id}}' , registrationWall : registrationWallVal, webType : 'app', sectionPath : 'apps', debug:  false });

			if(methode.freeviewCount > 5 && hasPaywall && window.payTheWall) {
				_showPaywall = true;
				payTheWall();
			}

			checkLoad('meter');
		});
	};

	var setupTracking = function() {
		s.pageName='{{meta.section}} | {{meta.title}}';
		s.channel='{{meta.section}}';
		s.prop1='{{meta.section}} | Specials';
		s.prop6='Infographic';
		s.prop41=s.eVar41='BostonGlobe.com';
		s.eVar20 = methode.subscribed ? 'logged in' : 'logged out';
		s.prop35 = methode.subscribed ? 'logged in' : 'logged out';
		s.prop3 = '{{meta.author}}';
		s.prop67 = '{{meta.page_id}}';
		s.eVar67 = '{{meta.page_id}}';

		// PAYWALL
		if (_showPaywall) {
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
	};

	var checkLoad = function(lib) {
		_loaded[lib] = true;

		if(_loaded.omniture && _loaded.meter) {
			setupTracking();
		}
	};

	// load libraries
	chartbeat();
	omniture();
	meter();
})();
