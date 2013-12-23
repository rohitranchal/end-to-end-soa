var db = require('../db');

exports.show = function(req, res){
	var s_id = req.query.s_id;
	console.log(s_id);
	res.render('scenario.jade');
	
};