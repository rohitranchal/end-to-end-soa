var db = require('../db');

var do_nothing_trust = function do_nothing_trust_update(from, to, cb) {
	//Nothing to do
};


var simple_trust = function simple_trust_update(from, to, cb) {
	cb(parseFloat(from) * (parseFloat(to)/from));
};

var moving_avg_trust = function moving_avg_trust_update(from, to, cb) {
	//TODO
};

var no_lower_access_trust = function no_lower_access_trust_update(from, to, cb) {
	if(to < from) {
		//Punishment!!!
		cb(0);
	}
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

var default_trust_algo = 1;

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
exports.update = function(from, to, cb) {
	algorithm = algos[default_trust_algo];
	algorithm.alg(from, to, cb); //Call
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
