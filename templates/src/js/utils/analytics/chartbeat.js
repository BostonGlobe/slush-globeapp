import meta from '../../../../data/meta';

export default function chartbeat() {
	window._sf_startpt=(new Date()).getTime();
	window._sf_async_config={uid:8544,domain:'bostonglobe.com'};
	_sf_async_config.path = location.pathname;

	// Section and Author tagging
	_sf_async_config.sections = meta.section_chartbeat;
	_sf_async_config.authors = 'infographic';   //used for page type


	(function(){
		function loadChartbeat() {
			window._sf_endpt=(new Date()).getTime();
			var e = document.createElement('script');
			e.setAttribute('language', 'javascript');
			e.setAttribute('type', 'text/javascript');
			e.setAttribute('src', (('https:' == document.location.protocol) ? 'https://s3.amazonaws.com/' : 'http://') + 'static.chartbeat.com/js/chartbeat.js');
			document.body.appendChild(e);
		}
		var oldonload = window.onload;
		window.onload = (typeof window.onload != 'function') ?
			loadChartbeat : function() { oldonload(); loadChartbeat(); };
	})();
}
