var db = require('../../db');
var scenarios = require('../../routes/scenario');


var auth = function(from, to, id, cb) {
	// from.id
	// to.id
	
	//Obtain trust values for to the service based on Client Feedback algo
	db.get_service_trust_level_for_module(to.id, 'Client Feedback', function(to_trust_value) {
		if(to_trust_value != -1) {
			if(to_trust_value.trust_level < 0.6) {
				console.log('redirect' + to_trust_value.trust_level);
				cb(id, {code : 200, data : 'http://localhost:4115/'});

				//Rewire topology
				//Breack connection from.id to to.id
				scenarios.break_connection(from.id, to.id);

				//Add connection from.id to 16
				scenarios.add_connection(from.id, 15);

				scenarios.update_service_status(to.id, 'svc_live', 'remove');
				scenarios.update_service_status(to.id, 'svc_under_attack', 'add');
				scenarios.update_service_status(15, 'svc_backup', 'remove');
				scenarios.update_service_status(15, 'svc_live', 'add');


			} else {
				cb(id, {code : 200});	
			}
		} else {

			//Trust levels are not set yet
			cb(id, {code : 200});		
		}
	});
	
};

module.exports = {name :'Trust Based Interaction Rerouting', authorize : auth, policy : "NONE"};
