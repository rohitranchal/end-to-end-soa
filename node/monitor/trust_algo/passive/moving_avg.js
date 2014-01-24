var db = require('../../db');

var moving_avg_weight = 0.8;

var moving_avg_trust = function moving_avg_trust_update(from, to, cb) {
	if(from.trust_level != 0) {
		var new_trust_level = from.trust_level * moving_avg_weight + to.trust_level * (1 - moving_avg_weight);
		db.set_service_trust_level(from.id, new_trust_level);
		if(typeof cb != 'undefined') {
			console.log('Calling cb');
			cb(new_trust_level);
		}
	}
};

module.exports = {name : 'Moving Average', alg : moving_avg_trust};


