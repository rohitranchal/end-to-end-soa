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

var chained_trust = function chained_trust_update(from, to) {
	//Call simple trust update for this service
	simple_trust(from, to, function(n_tl) {
		db.get_caller_services(from.id, function(services) {
			//Call simple trust update for all services 
			//that called this service
			for(var i = 0; i < services.length; i++) {
				from.trust_level = n_tl;
				chained_trust_update(services[i], from);
			}
		});
	});
};
module.exports = {name : 'Chained Trust', alg : chained_trust};