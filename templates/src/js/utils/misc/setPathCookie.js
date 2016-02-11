import docCookies from './docCookies';

export default function setPathCookie() {
	// remove previous pathUrl cookie
	docCookies.removeItem('pathUrl', '/', '.bostonglobe.com');

	// get current path to graphic and set pathUrl
	var redirect = '/Page/Boston/2011-2020/WebGraphics/Metro/BostonGlobe.com/apps/index.html?';
	var path = redirect + window.location.pathname;
	docCookies.setItem('pathUrl', path, 'Session', '/', '.bostonglobe.com');
};
