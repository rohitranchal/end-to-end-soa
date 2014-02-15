var db = require('../../db');

var trust = function none(from, to, cb) {
	//Nothing to do!
};

var simple_auth = function(from, to, id, cb) {
	if(to.params.status == 'dead') {
		if (typeof to.params.redirect != 'undefined') {
			console.log('Service dead redirecting to: ' + to.params.redirect);
			// Cannot use this because it redirects before logging and req.apply
			//cb(id, {code : 307, headers : [{name : 'Location', value : to.params.redirect}]});
			cb(id, {code : 200, data : to.params.redirect});
		} else {
			console.log('Service dead, redirect not available');

			cb(id, {code : 403});
		}
	} else {
		cb(id, {code : 200});
	}
};

module.exports = {name :'Dead Service Redirect', alg : trust, authorize : simple_auth, policy : "NONE"};

