function html() {

	return `

<div class='socialconnect'>
	<div class='socialconnect--contain'>
		<button class="socialconnect--close">Close</button>
		<p class='socialconnect--hed'>Wake up with today’s <span>top</span> stories</p>
		<button class='socialconnect-facebook--button'>Connect with Facebook</button>
		<p class='socialconnect--separator'>or</p>
		<div class='socialconnect-email--validation'></div>
		
		<form id='email-form'> 
			<input class='socialconnect-email--input' type='email' placeholder='Enter your email address'/>
			<button type='submit' class='socialconnect-email--button'>Sign up &amp; return to story</button>
		</form>

		<div class='socialconnect--small'>
			<small>Already a subscriber?
				<a href='https://www.bostonglobe.com/eom/SysConfig/WebPortal/BostonGlobe/Framework/regi/final-login.jsp' onclick='var s=s_gi("nytbostonglobecom"); s.tl(this,"o","BG Meter Login");'>
					Sign in
				</a>
			</small>
			<small><a href='http://www.bostonglobe.com/tools/help/privacy' target='_blank'>Privacy Policy</a></small>
		</div>
	</div>
</div>

	`.trim()

}

export default html