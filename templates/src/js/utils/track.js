const track = (value) => {
	if (window.location.hostname.indexOf('localhost') > -1) console.log(val)
	if (typeof s_gi === 'function') {
		const tracker = s_gi('nytbostonglobecom')
		s.linkTrackVars = 'eVar15,channel,prop1
		s.linkTrackEvents = 'none'
		tracker.tl(true, 'o', value)
	}	
}

export default track
