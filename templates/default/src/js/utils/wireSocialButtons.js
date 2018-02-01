export default function wireSocialButtons(params) {
	const href = window.location.href
	const text = document.title
	const encodedText = encodeURIComponent(text)
	
	const mail = `mailto:?subject=${encodedText}&body=${encodedText}%0A%0A${href}`
	const mailNode = document.querySelectorAll(params.mail)

	for (let m = 0; m < mailNode.length; m++) {
		mailNode[m].setAttribute('href', mail)
	}

	const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(href)}`
	const facebookNode = document.querySelectorAll(params.facebook)

	for (let f = 0; f < facebookNode.length; f++) {
		facebookNode[f].setAttribute('href', facebook)
	}

	const twitter = `https://twitter.com/intent/tweet?text=${encodedText}&via=BostonGlobe&url=${encodeURI(href)}`
	const twitterNode = document.querySelectorAll(params.twitter)

	for (let t = 0; t < twitterNode.length; t++) {
		twitterNode[t].setAttribute('href', twitter)
	}
}
