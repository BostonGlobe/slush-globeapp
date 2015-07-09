var archieml = require('archieml');
var request = require('request');
var fs = require('fs');

// GOOGLE DOC ID GOES HERE
var id = '';
var url = 'https://docs.google.com/document/d/' + id + '/export?format=txt';

if(id) {
	request(url, function (error, response, body) {
		var parsed = archieml.load(body);
		var str = JSON.stringify(parsed);
		var output = 'src/data/copy.json';

		fs.writeFile(output, str, function(err){
			if(err) { 
				console.log(err);
			} else {
				console.log('file created at', output);
			}
		});
	});
} else {
	console.log('*** Add your google doc ID to copy.js ***');
}
