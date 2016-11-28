import setPathCookie from './utils/setPathCookie'
import removeMobileHover from './utils/removeMobileHover'
import wireSocialButtons from './utils/wireSocialButtons'

removeMobileHover()
setPathCookie()

// Add class to html if JS is loaded
document.querySelector('html').classList.add('has-loaded')

// Wire header social if present
if (document.querySelectorAll('.g-header__share').length) {
	wireSocialButtons({
		facebook: '.g-header__share-button--fb',
		twitter: '.g-header__share-button--tw',
	})
}
