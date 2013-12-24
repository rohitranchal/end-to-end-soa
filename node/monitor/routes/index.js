var db = require('../db');
var trust = require('../trust_algo');
url = require('url');

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
};

exports.service_list = function(req, res){
	db.get_services(function(val){
		res.render('service_list', { entries : val  });
	});
};

exports.add_service_show = function(req, res){
	res.render('add_service_show', {});
};

exports.add_service_process = function(req, res){
	var name = req.body.name;
	var trust_level = req.body.trust_level;

	db.add_service(name, trust_level);

	res.redirect('/service_list');
};

exports.interaction_list = function(req, res){
	db.get_interactions(function(val){
		res.render('interaction_list', { entries : val  });
	});
};

exports.interaction = function(req, res){
	var from  = req.query.from;
	var to  = req.query.to;
	var start  = req.query.start;
	var end  = req.query.end;

	if(typeof start == 'undefined') {
		start = null;
	}

	if(typeof end == 'undefined') {
		end = null;
	}

	from = url.parse(from);
	from = from.host;
	to = url.parse(to);
	to = to.host;
	
	db.get_service_id(from, function(from_id) {
		db.get_service_id(to, function(to_id) {
			db.add_interaction(from_id, to_id, start, end);

			if(start != null) { //When we get confirmation
				//Update trust level
				simple_update_trust_level(from_id, to_id);
			}
		});	
	});

	res.send('OK');
};


function simple_update_trust_level(from, to) {
	
	db.get_service_trust_level(from, function(f_tv) {
		db.get_service_trust_level(to, function(t_tv) {

			console.log(from + ' Old : ' + f_tv);
			
			trust.update(f_tv, t_tv, function(new_f_tv) {
				console.log(from + ' New : ' + new_f_tv);
				db.set_service_trust_level(from, new_f_tv);				
			});
			// //Calculate new trust level
			// f_tv = parseFloat(f_tv) * (parseFloat(t_tv)/f_tv);
			// db.set_service_trust_level(from, f_tv);
		});
	});
}