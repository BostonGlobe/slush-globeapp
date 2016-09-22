import setPathCookie from './utils/setPathCookie'
import removeMobileHover from './utils/removeMobileHover'

removeMobileHover()
setPathCookie()

// Add class to html if JS is loaded
document.getElementsByTagName('html')[0].className+='js-loaded'
