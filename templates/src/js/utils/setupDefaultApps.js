import setPathCookie from './misc/setPathCookie';
import wireSocialButtons from './misc/wireSocialButtons';
import removeMobileHover from './misc/removeMobileHover';
import copyrightYear from './misc/copyrightYear';

// some default functionality needed to setup apps
export default function setupDefaultApps() {

	wireSocialButtons({ element: { facebook: 'share-fb', twitter: 'share-tw' } });
	removeMobileHover();
	copyrightYear();
	setPathCookie();

}
