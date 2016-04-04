import loadFont from './misc/loadFont'
import setPathCookie from './misc/setPathCookie'
import wireSocialButtons from './misc/wireSocialButtons'
import removeMobileHover from './misc/removeMobileHover'

// some default functionality needed to setup apps
export default function setupDefaultApps() {
	loadFont([
		{ family: 'Miller', suffix: 'regular', weight: 400 },
		{ family: 'Benton', suffix: 'bold', weight: 600 },
		{ family: 'Miller-Banner', suffix: 'regular', weight: 600 },
	])
	wireSocialButtons({ facebook: '.share-fb', twitter: '.share-tw' })
	removeMobileHover()
	setPathCookie()
}
