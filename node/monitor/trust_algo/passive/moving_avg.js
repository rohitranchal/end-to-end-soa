var db = require('../../db');
var module_name = 'Moving Average';
var moving_avg_weight = 0.8;
var init_trust = 5;

var moving_avg_trust = function moving_avg_trust_update(interaction_id) {

	//Get from and to service IDs from the interaction table
	db.get_interaction_data(interaction_id, function(interaction_data) {

		db.get_service_trust_level_for_module(interaction_data.from_service, module_name, function(from_trust){

			db.get_service_trust_level_for_module(interaction_data.to_service, module_name, function(to_trust){

				if(from_trust == -1) {
					from_trust = init_trust;//bootstrap trust with a default value
				} else {
					from_trust = from_trust.trust_level;
				}

				if(to_trust == -1) {
					to_trust = init_trust;//bootstrap trust with a default value
				} else {
					to_trust = to_trust.trust_level;
				}

				//Calculate new trust value for the caller
				var tmp_trust_level = from_trust * moving_avg_weight + to_trust * (1 - moving_avg_weight);
				var new_trust_level = tmp_trust_level.toFixed(3);

				//Update interaction trust levels
				db.set_interaction_trust_level_for_module(interaction_id, module_name, from_trust, new_trust_level, to_trust, to_trust);

				//Update trust level of service
				db.set_service_trust_level_for_module(interaction_data.from_service, module_name, new_trust_level);
			});
		});
	});
};

module.exports = {name : module_name, alg : moving_avg_trust};
