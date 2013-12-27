var db = require('../db');
var fs = require('fs');

console.log('Loading scenarios ... ');
var files = fs.readdirSync('./scenarios/');

var scenarios = new Array();
//Load all availbale scenarios
for(var i = 0; i < files.length; i++) {
	console.log('Reading : ' + files[i]);
	fs.readFile('./scenarios/' + files[i], 'utf8', function(err, data) {
		if(err) {
			console.log(err);
		} else {
			scenarios[scenarios.length] = JSON.parse(data);
		}
		
	});	
}


exports.show = function(req, res){
	var s_id = req.query.s_id;

	db.get_scenario(s_id, function(scenario_data){
		db.get_services_of_scenario(s_id, function(svrs) {
			res.render('scenario.jade', 
					{'services' : svrs, 
					'scenario' : scenario_data});
		});
	});
};

//Return scenario topology to the scenario viewer.
exports.get_topology = function(req, res) {
	var s_id = req.query.s_id;

	//Linear search through the availalbe scenarios
	for(var i = 0; i < scenarios.length; i++) {
		if(scenarios[i].id == s_id) {
			var top = JSON.stringify(scenarios[i])
			res.send(top);
		}
	}
}