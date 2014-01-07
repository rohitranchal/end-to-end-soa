var db = require('../../db');

var no_lower_access_trust = function no_lower_access_trust_update(from, to) {
	if(to.trust_level < from.trust_level) {
		//Punishment!!!
		db.set_service_trust_level(from.id, 0);
	}
};

module.exports = {name : 'Lower Trusted Service Access Denied', alg : no_lower_access_trust};