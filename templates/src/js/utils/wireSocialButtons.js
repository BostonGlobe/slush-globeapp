export default function wireSocialButtons(params) {

	var href = window.location.href;
	var text = document.title;
	var encoded = encodeURIComponent(text);

	var facebook = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI(href);
	var facebookNode = document.getElementsByClassName(params.element.facebook);
	for (var f = 0; f < facebookNode.length; f++) {
		facebookNode[f].setAttribute('href', facebook);

		facebookNode[f].addEventListener('click', function(e) {
			var s=s_gi('nytbostonglobecom');
			s.linkTrackVars='eVar15,channel,prop1';
			s.linkTrackEvents='none';
			s.tl(this,'o', 'BG Elections Share Tools – Facebook - Top');
		});

	}

	var twitter = 'https://twitter.com/intent/tweet?text=' + encoded + '&via=BostonGlobe&url=' + encodeURI(href);
	var twitterNode = document.getElementsByClassName(params.element.twitter);
	for (var t = 0; t < twitterNode.length; t++) {

		twitterNode[t].setAttribute('href', twitter);

		twitterNode[t].addEventListener('click', function(e) {
			var s=s_gi('nytbostonglobecom');
			s.linkTrackVars='eVar15,channel,prop1';
			s.linkTrackEvents='none';
			s.tl(this,'o', 'BG Elections Share Tools – Twitter - Top');
		});

	}

};
