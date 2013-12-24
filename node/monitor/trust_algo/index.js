var db = require('../db');

var simple_trust = function simple_trust_update(from, to, cb) {
	cb(parseFloat(from) * (parseFloat(to)/from));
};

var moving_avg_trust = function moving_avg_trust_update(from, to, cb) {

};

var algos = new Array();
var tmp = {name :'Simple Trust', alg : simple_trust};
algos[algos.length] = tmp;

tmp = {name : 'Moving Average', alg : moving_avg_trust};
algos[algos.length] = tmp;

var default_trust_algo = 0;


exports.reset = function(req, res){
	db.reset_trust_levels(10); //Read this default value from config
	res.send(JSON.stringify('OK'));
};

//Call cb with the new trust value of 'from'
exports.update = function(from, to, cb) {
	algorithm = algos[default_trust_algo];
	console.log(algorithm)
	algorithm.alg(from, to, cb); //Call
};

exports.algo_list = function(cb) {
	cb(algos); //Return list
};

