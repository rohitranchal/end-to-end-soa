var db = require('../../db');
var module_name = 'Client Feedback';
var client_feedback_weight = 0.8;
var init_trust = 5;

var client_feedback_trust = function client_feedback_trust_update(interaction_id) {

	//Get from and to service IDs from the interaction table
	db.get_interaction_data(interaction_id, function(interaction_data) {

		if(interaction_data.start == null) {
			return;
		}

		var svc_feedback = JSON.parse(interaction_data.feedback);

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

				//Service feedback used to update to_trust
				//Service feedback integrity used to update from_trust
				var svc_sat = svc_feedback.satisfaction;
				var svc_wt = svc_feedback.weight;

				//Get integrity of this interaction from db
				//TODO: Logic for calculating integrity belief
				//To logic: To trust is adjusted according to client feedback and its wt
				//From Logic: SM interaction parameters: basically to's existing trust level.

				//To Logic: Heartbeat/Inflow data/Service view
				var ib = 0.8;

				console.log('\n---interaction: ' + svc_feedback.satisfaction);

				var tmp_trust_level = from_trust * client_feedback_satisfaction * client_feedback_weight * ib;
				var new_trust_level = tmp_trust_level.toFixed(3);

				//Update interaction trust levels
				db.set_interaction_trust_level_for_module(interaction_id, module_name, from_trust, new_trust_level, to_trust, to_trust);

				//Update trust level of service
				db.set_service_trust_level_for_module(interaction_data.from_service, module_name, new_trust_level);
			});
		});
	});
};

update_to_trust() {

}

module.exports = {name : module_name, alg : client_feedback_trust};
