var db = require('../../db');

var simple_avg_trust = function simple_avg_trust_update(from, to) {
	if(from.trust_level != 0) {
		var tmp_trust_level = (from.trust_level + to.trust_level)/2;
		var new_trust_level = tmp_trust_level.toFixed(3);
		db.set_service_trust_level(from.id, new_trust_level);
		if(typeof cb != 'undefined') {
			cb(new_trust_level);
		}
	}
};

module.exports = {name : 'Simple Average', alg : simple_avg_trust};

