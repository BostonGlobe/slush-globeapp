var username = require('./username.js');

module.exports = {
	copy: {
		google: {
			id: ''
		},
		methode: {
			section: '',
			story: []
		}
	},
	deploy: {
		ssh: {
			host: 'shell.boston.com',
			username: username,
			filepath: '/web/bgapps/html/graphics/||PATH-TO-APP||'
		}
	}
};
