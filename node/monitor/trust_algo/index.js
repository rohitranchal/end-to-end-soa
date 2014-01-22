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

var default_trust_algo = 4;
var default_active_trust_algo = 5;

exports.set_default_algo = function(algo_id_str) {
	algo_id = algo_id_str.substring(1);
	if(algo_id_str.indexOf('p') == 0) {
		//Passive algo
		if(algo_id >= 0 || algo_id < passive_algos.length) {
			default_trust_algo = algo_id;
		}
	} else if(algo_id_str.indexOf('a') == 0) {
		//Active algo
		if(algo_id >= 0 || algo_id < active_algos.length) {
			default_active_trust_algo = algo_id;
		}
	}
};

exports.get_default_algo = function(cb) {
	cb(default_trust_algo);
};

//Call cb with the new trust value of 'from'
exports.update = function(from, to) {
	algorithm = passive_algos[default_trust_algo];
	algorithm.alg(from, to); //Call
};

exports.authorize = function(from, to, callback) {
	algorithm = active_algos[default_active_trust_algo];

	algorithm.authorize(from, to, callback);
};

exports.update_block = function(from, to, callback) {
	algorithm = active_algos[default_active_trust_algo];
	algorithm.alg(from, to);
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
