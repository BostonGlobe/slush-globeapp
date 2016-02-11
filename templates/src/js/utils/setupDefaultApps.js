import docCookies from './docCookies';
import enableScroll from './enableScroll';
import disableScroll from './disableScroll';
import preventDefaultForScrollKeys from './preventDefaultForScrollKeys';
import preventDefault from './preventDefault';
import payTheWall from './payTheWall';
import ieVersionOrLess from './ieVersionOrLess';
import setPathCookie from './setPathCookie';
import wireSocialButtons from './wireSocialButtons';
import removeMobileHover from './removeMobileHover';
import copyrightYear from './copyrightYear';
import isMobile from './isMobile';

// some default functionality needed to setup apps
export default function setupDefaultApps() {

	window.isMobile = isMobile;
	window.ieVersionOrLess = ieVersionOrLess;
	window.payTheWall = payTheWall;
	window.preventDefault = preventDefault;
	window.preventDefaultForScrollKeys = preventDefaultForScrollKeys;
	window.disableScroll = disableScroll;
	window.enableScroll = enableScroll;
	window.docCookies = docCookies;

	wireSocialButtons({
		element: {
			facebook: 'share-fb',
			twitter: 'share-tw'
		}
	});

	removeMobileHover();
	copyrightYear();
	setPathCookie();

}
