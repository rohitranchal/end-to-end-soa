var db = require('../db');
var fs = require('fs');

var passive_algos = new Array();
var active_algos = new Array();

console.log('Loading trust algorithms ... ');
var files = fs.readdirSync('./trust_algo/passive/');
for(var i = 0; i < files.length; i++) {
	console.log('Reading : ' + files[i]);
	passive_algos[passive_algos.length] = require('./passive/' + files[i]);
}
var files = fs.readdirSync('./trust_algo/active/');
for(var i = 0; i < files.length; i++) {

	if(files[i].indexOf('.js', files[i].length - 3) !== -1) {
		console.log('Reading : ' + files[i]);
		active_algos[active_algos.length] = require('./active/' + files[i]);
	}
}

var default_trust_algo = new Array();
var default_active_trust_algo = new Array();

exports.toggle_trust_algo = function(algo_id_str) {
	algo_id = algo_id_str.substring(1);
	if(algo_id_str.indexOf('p') == 0) {
		if(algo_id >= 0 || algo_id < passive_algos.length) {
			//If the algo is in the list
			var found = false;
			for(var i = 0; i < default_trust_algo.length; i++) {
				//remove
				if(default_trust_algo[i] == algo_id) {
					found = true;
					default_trust_algo.splice(i, 1);
				}
			}
			if(!found) {
				//else add it in
				default_trust_algo[default_trust_algo.length] = algo_id;
			}
		}
	} else if(algo_id_str.indexOf('a') == 0) {
		//Active algo
		if(algo_id >= 0 || algo_id < active_algos.length) {
			//If the algo is in the list
			var found = false;
			for(var i = 0; i < default_active_trust_algo.length; i++) {
				//remove
				if(default_active_trust_algo[i] == algo_id) {
					found = true;
					default_active_trust_algo.splice(i, 1);
				}
			}
			if(!found) {
				//else add it in
				default_active_trust_algo[default_active_trust_algo.length] = algo_id;
			}
		}
	}
};

exports.get_default_active_algo_list = function(cb) {
	var algos = new Array();
	for(var i = 0; i < default_active_trust_algo.length; i++) {
		var a_id = default_active_trust_algo[i];
		var a_name = active_algos[a_id].name;
		algos[i] = {'id' : a_id, 'name' : a_name};
	}
	cb(algos);
};


/*
Update registered trust algorithms with the given interaction 
*/
exports.update = function(interaction_id) {
	for(var i = 0; i < default_trust_algo.length; i++) {
		//Call each enabled algo
		algorithm = passive_algos[default_trust_algo[i]];
		algorithm.alg(interaction_id); //Call
	}
};

exports.authorize = function(from, to, callback) {

	if(default_active_trust_algo.length == 0) {
		//If there are no active algos enabled
		//authorize the interaction
		callback({code : 200});
	}

	var authz_status_vals = new Array(default_active_trust_algo.length);
	for(var i = 0; i < authz_status_vals.length; i++) {
		authz_status_vals[i] = "-1";
	}

	var authz_status = function(algo_id, decision) {
		if(decision.code != 200) {
			callback(decision);
			return;
		}

		authz_status_vals[algo_id] = 1;

		if(authz_status_vals.indexOf("-1") == -1) {
			//Every value is set to 1
			//We are good to go
			//callback({code: 200});
			callback(decision);
			return;
		}
	}

	for(var i = 0; i < default_active_trust_algo.length; i++) {
		var algo_id = default_active_trust_algo[i];
		algorithm = active_algos[algo_id];
		algorithm.authorize(from, to, i, authz_status);
	}

};


exports.algo_list = function(cb) {
	var p_a = new Array();
	var a_a = new Array();

	for(var i = 0; i < passive_algos.length; i++) {
		p_a[i] = {id: i,
					name : passive_algos[i].name,
					alg : String(passive_algos[i].alg)};
	}

	for(var i = 0; i < active_algos.length; i++) {
		a_a[i] = {id: i,
					name : active_algos[i].name,
					alg : String(active_algos[i].alg),
					auth : String(active_algos[i].authorize)};
	}

	algos = {p_algos : p_a, p_default : default_trust_algo,
			a_algos : a_a, a_default : default_active_trust_algo};

	cb(algos); //Return list
};

exports.get_authz_oplicy = function(id, cb) {
	cb({policy: active_algos[id].policy});
};
