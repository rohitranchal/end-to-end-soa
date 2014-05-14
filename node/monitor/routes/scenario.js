var db = require('../db');
var fs = require('fs');
var trust = require('../trust_algo');

console.log('Loading scenarios ... ');
var files = fs.readdirSync('./scenarios/passive/');

var scenarios = new Array();
//Load all availbale scenarios
for(var i = 0; i < files.length; i++) {
	console.log('Reading : ' + files[i]);
	fs.readFile('./scenarios/passive/' + files[i], 'utf8', function(err, data) {
		if(err) {
			console.log(err);
		} else {
			scenarios[scenarios.length] = JSON.parse(data);
		}
		
	});
}

files = fs.readdirSync('./scenarios/active/');

var active_scenarios = new Array();
//Load all availbale scenarios
for(var i = 0; i < files.length; i++) {
	console.log('Reading : ' + files[i]);
	fs.readFile('./scenarios/active/' + files[i], 'utf8', function(err, data) {
		if(err) {
			console.log(err);
		} else {
			active_scenarios[active_scenarios.length] = JSON.parse(data);
		}
		
	});	
}



exports.show_all = function(req, res) {
	res.render('scenario_list', {passive_sl : scenarios, active_sl : active_scenarios});
};

exports.show = function(req, res){
	var s_id = req.query.s_id;
	var type = req.query.type;

	//Linear search through the availalbe scenarios
	var scenario = null;
	if(type == 'passive') {
		for(var i = 0; i < scenarios.length; i++) {
			if(scenarios[i].id == s_id) {
				scenario = scenarios[i];
			}
		}
	} else {
		for(var i = 0; i < active_scenarios.length; i++) {
			if(active_scenarios[i].id == s_id) {
				scenario = active_scenarios[i];
			}
		}
	}

	var tmp_s = scenario.services;
	
	scenario.type = type;
	s_list = scenario.services.join(',');
	db.get_services_of_scenario(s_list, function(svrs) {
		scenario.services = svrs;
		res.render('scenario', scenario);
		scenario.services = tmp_s;
	});	

	
};

//Return the trust levels of currently enabled trust modules
exports.get_scenario_trust_levels = function(req, res) {
	var s_id = req.query.s_id;
	var type = req.query.type;

	var tmp_scenarios = active_scenarios;
	if(type == 'passive') {
		tmp_scenarios = scenarios;
	}

	var scn = null;
	for(var i = 0; i < tmp_scenarios.length; i++) {
		if(tmp_scenarios[i].id == s_id) {

			//Found the scenario
			scn = tmp_scenarios[i];
		}
	}

	var results = new Array();
	if(scn != null) {
		//Get the trust levels
		trust.get_default_trust_algo_list(function(algos) {

			//If nothing is enabled
			if(algos.length == 0) {
				res.send(new Array());
			}

			for(var i = 0; i < algos.length; i++) {

				db.get_services_trust_level_for_module(scn.services, algos[i].name, function(module_name, values) {

					results[results.length] = {'trust_module' : module_name, 'services' : values};

					//Make sure we have all results before we send
					if(results.length == algos.length) {
						res.send(results);
					}
				});
			}
		});
	}
}

//Return scenario topology to the scenario viewer.
exports.get_topology = function(req, res) {
	var s_id = req.query.s_id;
	var type = req.query.type;

	if(type == 'passive') {
		for(var i = 0; i < scenarios.length; i++) {
			if(scenarios[i].id == s_id) {
				var top = JSON.stringify(scenarios[i])
				res.send(top);
			}
		}
	} else {
		for(var i = 0; i < active_scenarios.length; i++) {
			if(active_scenarios[i].id == s_id) {
				var top = JSON.stringify(active_scenarios[i])
				res.send(top);
			}
		}
	}
}