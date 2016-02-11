export default function payTheWall() {
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
