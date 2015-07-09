/*! loadJS: load a JS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. (Based on http://goo.gl/REQGQ by Paul Irish). Licensed MIT */
function loadJS( src, cb ){
	"use strict";
	var ref = window.document.getElementsByTagName( "script" )[ 0 ];
	var script = window.document.createElement( "script" );
	script.src = src;
	script.async = true;
	ref.parentNode.insertBefore( script, ref );
	if (cb && typeof(cb) === "function") {
		script.onload = cb;
	}
	return script;
}

/* !loadCSS: load a CSS file asynchronously. [c]2014 @scottjehl, Filament Group, Inc. Licensed MIT */
function loadCSS( href, before, media, callback ){
	"use strict";
	var ss = window.document.createElement( "link" );
	var ref = before || window.document.getElementsByTagName( "script" )[ 0 ];
	var sheets = window.document.styleSheets;
	ss.rel = "stylesheet";
	ss.href = href;
	ss.media = "only x";
	if( callback ) {
		ss.onload = callback;
	}
	ref.parentNode.insertBefore( ss, ref );
	ss.onloadcssdefined = function( cb ){
		var defined;
		for( var i = 0; i < sheets.length; i++ ){
			if( sheets[ i ].href && sheets[ i ].href === ss.href ){
				defined = true;
			}
		}
		if( defined ){
			cb();
		} else {
			setTimeout(function() {
				ss.onloadcssdefined( cb );
			});
		}
	};
	ss.onloadcssdefined(function() {
		ss.media = media || "all";
	});
	return ss;
}

/* 
	async font loading for Globe fonts
*/

/*! FilamentGroup.com - v0.1.0 - 2014-07-24
* http://filamentgroup.com/
* Copyright (c) 2014 Filament Group *//*! EnhanceJS: a progressive enhancement boilerplate. Copyright 2014 @scottjehl, Filament Group, Inc. Licensed MIT */
(function( window, undefined ) {
  var filepath = 'https://apps.bostonglobe.com/common/font/';
  "use strict";
  var doc = window.document;
  if( !( "querySelector" in doc ) ){
    return;
  }
  var supportsWoff2 = (function( win ){
    if( !( "FontFace" in win ) ) {
      return false;
    }
    var f = new win.FontFace( "t", 'url( "data:application/font-woff2," ) format( "woff2" )' );
    f.load().catch(function(){});
    return f.status === 'loading';
  })( window );

  var ua = navigator.userAgent,
    fontFileUrl = filepath + "woff.css";
  if( supportsWoff2 ) {
    fontFileUrl = filepath + "woff2.css";
  } else if( ua.indexOf( "Android" ) > -1 && ua.indexOf( "like Gecko" ) > -1 && ua.indexOf( "Chrome" ) === -1 ){
    fontFileUrl = filepath + 'ttf.css';
  }
  loadCSS( fontFileUrl );
}( this ));