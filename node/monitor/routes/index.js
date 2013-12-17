var db = require('../db');

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
	var s_name = req.body.name;
	var s_trust_level = req.body.trust_level;

	db.add_service(s_name, s_trust_level);

	res.redirect('/service_list');
};

exports.interaction = function(req, res){
	console.log(req.query);
	res.send('OK');
};
