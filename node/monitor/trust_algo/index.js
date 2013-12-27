var db = require('../db');

var do_nothing_trust = function do_nothing_trust_update(from, to) {
	//Nothing to do
};

var simple_trust = function simple_trust_update(from, to, cb) {
	if(from.trust_level != 0) {
		var new_trust_level = from.trust_level * to.trust_level/from.trust_level;
		db.set_service_trust_level(from.id, new_trust_level);
		cb(new_trust_level);	
	}
};

var moving_avg_trust = function moving_avg_trust_update(from, to) {
	//TODO
};

var no_lower_access_trust = function no_lower_access_trust_update(from, to) {
	if(to.trust_level < from.trust_level) {
		//Punishment!!!
		db.set_service_trust_level(form.id, 0);
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

var algos = new Array();

var tmp = {name :'Do Nothing (Trust Update Disabled)', alg : do_nothing_trust};
algos[algos.length] = tmp;

var tmp = {name :'Simple Trust', alg : simple_trust};
algos[algos.length] = tmp;

tmp = {name : 'Moving Average', alg : moving_avg_trust};
algos[algos.length] = tmp;

tmp = {name : 'Lower Trusted Service Access Denied', alg : no_lower_access_trust};
algos[algos.length] = tmp;

tmp = {name : 'Chained Trust', alg : chained_trust};
algos[algos.length] = tmp;


var default_trust_algo = 4;

exports.set_default_algo = function(algo_id){
	if(algo_id >= 0 || algo_id < algos.length) {
		default_trust_algo = algo_id;	
	}
};

exports.get_default_algo = function(cb) {
	cb(default_trust_algo);
};

exports.reset = function(){
	db.reset_trust_levels(10); //Read this default value from config
};

//Call cb with the new trust value of 'from'
exports.update = function(from, to) {
	algorithm = algos[default_trust_algo];
	algorithm.alg(from, to); //Call
};

exports.algo_list = function(cb) {
	var ret = new Array();

	for(var i = 0; i < algos.length; i++) {
		ret[i] = {id: i, 
					name : algos[i].name, 
					alg : String(algos[i].alg)};
	}

	cb(ret); //Return list
};
