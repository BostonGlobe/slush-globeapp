// some default functionality needed to setup apps
(function() {
	var init = function() {
		setupSocial({
			element: {
				facebook: 'share-fb',
				twitter: 'share-tw'
			}
		});

		removeMobileHover();
		copyrightYear();
		setPathCookie();
	};

	var setupSocial = function(params) {
		var href = window.location.href;
		var text = document.title;
		var encoded = encodeURIComponent(text);

		var facebook = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI(href);
		var facebookNode = document.getElementsByClassName(params.element.facebook);
		for (var f = 0; f < facebookNode.length; f++) {
			facebookNode[f].setAttribute('href', facebook);
		}

		var twitter = 'https://twitter.com/intent/tweet?text=' + encoded + '&via=BostonGlobe&url=' + encodeURI(href);
		var twitterNode = document.getElementsByClassName(params.element.twitter);
		for (var t = 0; t < twitterNode.length; t++) {
			twitterNode[t].setAttribute('href', twitter);
		}
	};

	var removeMobileHover = function() {
		// Inspired by: https://gist.github.com/rcmachado/7303143 and http://mvartan.com/2014/12/20/fixing-sticky-hover-on-mobile-devices/
		if (isMobile.any()) {
			// Loop through each stylesheet
			for (var sheetI = document.styleSheets.length - 1; sheetI >= 0; sheetI--) {
				var sheet = document.styleSheets[sheetI];

				// Verify if cssRules exists in sheet
				if (sheet.cssRules) {

					// Loop through each rule in sheet
					for (var ruleI = sheet.cssRules.length - 1; ruleI >= 0; ruleI--) {
						var rule = sheet.cssRules[ruleI];

						// Verify rule has selector text
						if (rule.selectorText) {

						// Replace hover psuedo-class with active psuedo-class
							rule.selectorText = rule.selectorText.replace(":hover", ":active");
						}
					}
				}
			}
		}
	};

	var copyrightYear = function() {
		var d = new Date();
		var year = d.getFullYear();
		var el = document.getElementsByClassName('g-footer--copyright-year');
		if (el.length) {
			el[0].innerHTML = year;
		}
	};

	var setPathCookie = function() {
		// remove previous pathUrl cookie
		docCookies.removeItem('pathUrl', '/', '.bostonglobe.com');

		// get current path to graphic and set pathUrl
		var redirect = '/Page/Boston/2011-2020/WebGraphics/Metro/BostonGlobe.com/apps/index.html?';
		var path = redirect + window.location.pathname;
		docCookies.setItem('pathUrl', path, 'Session', '/', '.bostonglobe.com');
	};

	window.isMobile = {
		Android: function() { return navigator.userAgent.match(/Android/i); },

		BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); },

		iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },

		Opera: function() { return navigator.userAgent.match(/Opera Mini/i); },

		Windows: function() { return navigator.userAgent.match(/IEMobile/i); },

		any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
	};

	window.ieVersionOrLess = function(x) {
		x = x || 0;
		var htmlClasses = document.getElementsByTagName('html')[0].className;
		var matches = htmlClasses.match(/ie(\d+)/);
		return matches && +matches[1] <= x;
	};

	window.payTheWall = function() {
		var el = document.getElementsByClassName('paywall')[0];
		el.classList.remove('hide');
		disableScroll();
		if (isMobile.any()) {
			el.style.backgroundSize = 'cover';
			el.style.background = 'url("https://apps.bostonglobe.com/common/paywall/press.jpg")';
		} else {
			var filepath = 'https://apps.bostonglobe.com/common/paywall/press';
			
			var html = '';
			html += '<video loop muted autoplay poster="' + filepath + '.jpg" class="fullscreen-bg__video">';
			html += '<source src="' + filepath + '.mp4" type="video/mp4">';
			html += '</video>';
			
			var div = document.createElement('div');
			div.classList.add('fullscreen-bg');
			div.innerHTML = html;
			el.insertBefore(div, el.firstChild);
		}
	};

	window.preventDefault = function(e) {
		e = e || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;  
	};

	window.preventDefaultForScrollKeys = function(e) {
		var keys = {38: 1, 40: 1, 32: 1};
	    if (keys[e.keyCode]) {
	        preventDefault(e);
	        return false;
	    }
	};

	window.disableScroll = function() {
		if (window.addEventListener) {
			window.addEventListener('DOMMouseScroll', preventDefault, false);
		}
		window.onwheel = preventDefault; // modern standard
		window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
		window.ontouchmove  = preventDefault; // mobile
		document.onkeydown  = preventDefaultForScrollKeys;
	};

	window.enableScroll = function() {
		if (window.removeEventListener) {
			window.removeEventListener('DOMMouseScroll', preventDefault, false);
		}
		window.onmousewheel = document.onmousewheel = null; 
		window.onwheel = null; 
		window.ontouchmove = null;  
		document.onkeydown = null;  
	};

	// from mozilla https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
	// removed encodeURI from setItem
	window.docCookies = {
		getItem: function (sKey) {
			if (!sKey) { return null; }
			return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	  	},
		setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
			if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
				var sExpires = "";
			if (vEnd) {
				switch (vEnd.constructor) {
					case Number:
						sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
						break;
					case String:
						sExpires = "; expires=" + vEnd;
						break;
					case Date:
						sExpires = "; expires=" + vEnd.toUTCString();
						break;
				}
			}
	    	document.cookie = sKey + "=" + sValue + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
	    	return true;
	  	},
		removeItem: function (sKey, sPath, sDomain) {
			if (!this.hasItem(sKey)) { return false; }
			document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
			return true;
		},
		hasItem: function (sKey) {
			if (!sKey) { return false; }
			return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		},
		keys: function () {
			var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
			for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
			return aKeys;
		}
	};

	init();
})();
