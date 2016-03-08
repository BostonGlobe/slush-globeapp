import setPathCookie from './misc/setPathCookie'
import wireSocialButtons from './misc/wireSocialButtons'
import removeMobileHover from './misc/removeMobileHover'

// some default functionality needed to setup apps
export default function setupDefaultApps() {
	wireSocialButtons({ element: { facebook: 'share-fb', twitter: 'share-tw' } })
	removeMobileHover()
	setPathCookie()
}
