import disableScroll from './disableScroll'
import isMobile from '../misc/isMobile'
import toggleClass from '../misc/toggleClass'
import insertStyle from '../misc/insertStyle'
import getMetaContent from '../misc/getMetaContent'

import html from './paywall-html'
import css from './paywall-css'

export default function showPaywall() {

	disableScroll()

	// insert css
	insertStyle(css)

	const tempDiv1 = document.createElement('div')
	tempDiv1.innerHTML = html(getMetaContent('pageId'))
	const el = tempDiv1.firstChild

	if (isMobile.any()) {

		el.style.backgroundSize = 'cover'
		el.style.background = 'url("https://apps.bostonglobe.com/common/paywall/press.jpg")'

	} else {

		const filepath = 'https://apps.bostonglobe.com/common/paywall/press'

		const videoHTML = `
			<video loop muted autoplay poster='${filepath}.jpg' class='fullscreen-bg__video'>
				<source src='${filepath}.mp4' type='video/mp4'>
			</video>
		`.trim()

		const tempDiv2 = document.createElement('div')
		toggleClass.add(tempDiv2, 'fullscreen-bg')
		tempDiv2.innerHTML = videoHTML
		
		el.insertBefore(tempDiv2, el.firstChild)

	}

	document.body.appendChild(el)

}
