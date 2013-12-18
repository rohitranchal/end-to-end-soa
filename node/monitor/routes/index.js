var db = require('../db');
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
		});	
	});

	res.send('OK');
};
