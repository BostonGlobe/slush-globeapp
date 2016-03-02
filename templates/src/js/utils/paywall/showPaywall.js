import disableScroll from './disableScroll'
import isMobile from '../misc/isMobile'
import { addClass, removeClass } from '../misc/toggleClass'

export default function showPaywall() {
	const el = document.querySelector('paywall')
	removeClass(el, 'hide')

	disableScroll()

	if (isMobile.any()) {
		el.style.backgroundSize = 'cover'
		el.style.background = 'url("https://apps.bostonglobe.com/common/paywall/press.jpg")'
	} else {
		const filepath = 'https://apps.bostonglobe.com/common/paywall/press'

		const html = `
			<video loop muted autoplay poster='${filepath}.jpg' class='fullscreen-bg__video'>
				<source src='${filepath}.mp4' type='video/mp4'>
			</video>
		`.trim()

		const div = document.createElement('div')
		addClass(div, 'fullscreen-bg')
		div.innerHTML = html
		el.insertBefore(div, el.firstChild)
	}
}
