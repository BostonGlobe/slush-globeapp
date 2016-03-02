function getMetaContent(property) {
	
	const metas = document.getElementsByTagName('meta')

   	for (let i = 0; i < metas.length; i++) { 
   		
   		const prop = metas[i].getAttribute('property')

		if ( prop === property) return metas[i].getAttribute('content')

   } 

    return ''

}

export default getMetaContent