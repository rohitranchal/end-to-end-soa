var db = require('../../db');
var scenarios = require('../../routes/scenario');


var auth = function(from, to, id, cb) {
	// from.id
	// to.id
	
	//Obtain trust values for to the service based on Client Feedback algo
	db.get_service_trust_level_for_module(to.id, 'Client Feedback', function(to_trust_value) {
		if(to_trust_value != -1) {
			if(to_trust_value.trust_level < 0.8) {
				console.log('redirect');
				cb(id, {code : 200, data : 'http://localhost:4115/'});

				//Rewire topology


			} else {
				cb(id, {code : 200});	
			}
		} else {

			//Trust levels are not set yet
			cb(id, {code : 200});		
		}
	});
	
};

module.exports = {name :'Client Feedback Based Authorization', authorize : auth, policy : "NONE"};
