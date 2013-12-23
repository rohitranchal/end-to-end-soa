var db = require('../db');

exports.show = function(req, res){
	var s_id = req.query.s_id;

	db.get_scenario(s_id, function(scenario_data){
		db.get_services_of_scenario(s_id, function(svrs) {
			res.render('scenario.jade', 
					{'services' : svrs, 
					"scenario" : scenario_data});
		});
	});
};

//Return scenario topology to the scenario viewer.
exports.get_topology = function(req, res) {
	var s_id = req.query.s_id;
	if(s_id == 1) {
			var svrs = new Array(1, 2);

			var conns = new Array();
			conns[0] = new Array(1, 2);

			var topology = {services: svrs, connections: conns};

			res.send(JSON.stringify(topology));	
	} else if (s_id == 2) {
			var svrs = new Array(3, 4, 5);

			var conns = new Array();
			conns[0] = new Array(3, 4);
			conns[1] = new Array(3, 5);
			var topology = {services: svrs, connections: conns};

			res.send(JSON.stringify(topology));	
	} else if(s_id == 3) {
			var svrs = new Array(6, 7, 8);

			var conns = new Array();
			conns[0] = new Array(6, 7);
			conns[1] = new Array(7, 8);

			var topology = {services: svrs, connections: conns};

			res.send(JSON.stringify(topology));	
	}
}