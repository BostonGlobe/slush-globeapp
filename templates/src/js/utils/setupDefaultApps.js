import loadFont from './misc/loadFont'
import setPathCookie from './misc/setPathCookie'
import removeMobileHover from './misc/removeMobileHover'

// some default functionality needed to setup apps
export default function setupDefaultApps() {
	loadFont([
		{ family: 'Miller', suffix: 'regular', weight: 400 },
		{ family: 'Benton', suffix: 'bold', weight: 600 },
	])
	removeMobileHover()
	setPathCookie()
}
