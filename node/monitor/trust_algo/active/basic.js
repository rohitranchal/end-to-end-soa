var db = require('../../db');

var simple_trust = function simple_trust_update(from, to, cb) {
	if(from.trust_level != 0) {
		var new_trust_level = from.trust_level * to.trust_level/from.trust_level;
		db.set_service_trust_level(from.id, new_trust_level);
		if(typeof cb != 'undefined') {
			cb(new_trust_level);
		}
	}
};

var simple_auth = function(from, to, cb) {
	if(to.trust_level < from.trust_level) {
		cb(0);
	} else {
		cb(1);
	}
};

module.exports = {name :'Simple Blocking Trust', alg : simple_trust, authorize : simple_auth};