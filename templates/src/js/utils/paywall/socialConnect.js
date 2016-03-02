import getJSON from 'get-json-lite'
import isMobile from './../misc/isMobile'
import loadJS from '../misc/loadJS'

import { addClass, removeClass } from '../misc/toggleClass'

function onEmailSubmit(e) {
	
	e.preventDefault()

	// get and send
	const emailInput = document.querySelector('.socialconnect-email--input')

	const valid = emailInput.checkValidity()
	const username = emailInput.value.trim()
	
	if (username.length && valid) {

		const data = {username}
		sendEmail(data)

	}

	return false

}

function loginToFacebook() {
	
	FB.login(getFacebookData, { scope: 'public_profile,email' })

}

function setupEvents() {
	const facebookButton = document.querySelector('.socialconnect-facebook--button')
	const closeButton = document.querySelector('.socialconnect--close')
	const form = document.getElementById('email-form')

	facebookButton.addEventListener('click', loginToFacebook)
	closeButton.addEventListener('click', closeModal)
	form.addEventListener('submit', onEmailSubmit)
	
}


function show() {

	const el = document.querySelector('.socialconnect')
	removeClass(el, 'display-none')

	setupEvents()
	
	if (isMobile.any()) {
		const message = document.querySelector('.socialconnect-email--message')
		addClass(message, 'display-none')
	}

}

function getFacebookData(resp) {
	
	if (resp.authResponse) {

		FB.api('/me', response => {

			const username = response.email
			const firstName = response.first_name
			const lastName = response.last_name
			const gender = response.gender ? (response.gender === 'male' ? 'M' : 'F' ) : ''

			const data = {username, firstName, lastName, gender}

			sendEmail(data)

		})

	}

}

function toQueryString(obj) {
    
    const keys = Object.keys(obj)
    
    return keys.map( key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&')

}

function sendEmail({ username, firstName = '', lastName = '', gender = '' }) {
	
	const source = 'socialConnectPrimaries'
	const subscribeNewsletter = 19172036
	const a = 'sub'

	const data = {
		username,
		firstName,
		lastName,
		gender,
		source,
		subscribeNewsletter,
		a
	}

	const onSuccess = function(response) {			
		
		const s = s_gi('nytbostonglobecom')
		
		s.linkTrackVars='events'
		s.linkTrackEvents='event28'
		s.events='event28'
		s.tl(true, 'o', 'BG Social Connect – Success', null, 'navigate')
	
	}

	const onError = function(error) {

		console.error(error)

	}

	const url = `/eom/SysConfig/WebPortal/BostonGlobe/Framework/newsletter/newsletter_signup.jsp?${toQueryString(data)}`

 	getJSON(url, onSuccess, onError)

    closeModal()

}


function closeModal() {
	
	const el = document.querySelector('.socialconnect')
	addClass(el, 'display-none')

}

export default = {

	load: function(cb) {

		loadJS('//connect.facebook.net/en_US/sdk.js', cb)

	},

	setup: function() {
		
		FB.init({
			appId 		: '751395421611272',
			xfbml		: true,
			cookie		: true,
			version 	: 'v2.2',
		})

		if (!methode.subscribed && methode.freeviewCount === 1 && methode.freeviewCountIncremented) {
			
			show()

		}
	}	
};