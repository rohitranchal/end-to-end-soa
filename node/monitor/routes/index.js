var db = require('../db');
var trust = require('../trust_algo');
url = require('url');
request = require('request');

exports.index = function(req, res){
	// res.render('index');
	res.redirect('/scenario_list');
};

exports.service_list = function(req, res){
	db.get_services(function(val){
		res.render('service_list', { entries : val  });
	});
};

exports.service = function(req, res) {
	db.get_service(req.query.id, function(val){
		if(val != null) {
			res.render('service', val);
		} else {
			res.send('Invalid Service id : ' + req.query.id);
		}

	});
};

exports.update_service_params = function(req, res) {
	var params = req.body.params;
	var sid = req.body.id;
	db.update_service_params(sid, params, function(){
		res.send('OK');
	});
};


exports.store_heartbeat = function(msg) {
	//console.log(msg);

	//TODO: Store
};


///////////////////////////////////////////////////////////////////////////////
////////////TRUST RELATED
///////////////////////////////////////////////////////////////////////////////
exports.set_trust_levels = function(req, res) {
	//Get the list of services
	var values = req.body.values;
	for(var i = 0; i < values.length; i++) {
		console.log(values[i]);
		db.set_service_trust_level(values[i].name, values[i].value);
	}

	res.send('OK');
};

exports.trust_values_reset = function(req, res) {
	trust.reset();
	res.send('OK');
};

exports.trust_algo_list = function(req, res) {
	trust.algo_list(function(list) {
		res.render('trust_algo_list', list);
	});
};

exports.get_default_trust_algo = function(req, res) {
	trust.get_default_algo(function(algo_id) {
		res.send(algo_id);
	});
};

exports.show_active_authz_policy = function(req, res) {
	trust.get_authz_oplicy(req.query.id, function(val) {
		res.render('authz_policy', val)
	});
};

exports.toggle_trust_algo = function(req, res) {
	var algo_id  = req.body.algo_id;
	trust.toggle_trust_algo(algo_id);
	res.send('OK');
};

///////////////////////////////////////////////////////////////////////////////
////////////TRUST RELATED : END
///////////////////////////////////////////////////////////////////////////////

exports.try_it = function(req, res) {
	request(req.body.link, function (error, response, body) {
		res.send(body)
	});
}

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

///////////////////////////////////////////////////////////////////////////////
////////////MONITOR RELATED
///////////////////////////////////////////////////////////////////////////////
exports.interaction = function(msg){

	console.log(msg);

	//convert msg to JSON
	msg = JSON.parse(msg);
	var from  = msg.from;
	var to  = msg.to;
	var data = msg.data;

	//Interaction metadata
	var i_meta = {};
	if(typeof msg.start == 'undefined') {
		i_meta.start_time = null;
	} else {
		i_meta.start_time = msg.start;
	}
	if(typeof msg.end == 'undefined') {
		i_meta.end_time = null;
	} else {
		i_meta.end_time = msg.end;
	}

	from = url.parse(from);
	to = url.parse(to);

	db.get_service_id(from.host, function(from_id) {
		db.get_service_id(to.host, function(to_id) {

			from.id = from_id;
			from.data = data; //Setting data if there's any
			to.id = to_id;

			update_trust_level(from, to, i_meta);

		});
	});
};


function update_trust_level(from, to, i_meta) {

	db.get_service_trust_level(from.id, function(f_tv) {
		db.get_service_trust_level(to.id, function(t_tv) {

			//We are recording both the attempt of an interaction and
			//the actual interaction details.
			//when the actual interaction happens, i_meta will contain
			//a start and an end time
			if(i_meta.start_time != null) {
				//Interaction actually happened
				//Do trust levels update
				from.trust_level = f_tv;
				to.trust_level = t_tv;

				trust.update(from, to, function(f_new_tv, t_new_tv) {
					if(typeof t_new_tv == 'undefined') {
						t_new_tv = t_tv;
					}
					//Add interaction with metadata
					db.add_interaction(from.id, to.id, i_meta.start_time, i_meta.end_time,
						f_tv, t_tv, f_new_tv, t_new_tv);
				});
			} else {
				db.add_interaction(from.id, to.id);
			}

		});
	});
}

exports.interaction_block = function(req, res){
	var from  = req.query.from;
	var to  = req.query.to;
	var start  = req.query.start;
	var end  = req.query.end;
	var data = req.query.data;

	if(typeof start == 'undefined') {
		start = null;
	}

	if(typeof end == 'undefined') {
		end = null;
	}


	from = url.parse(from);
	// from = from.host;

	to = url.parse(to);
	// to = to.host;

	db.get_service_id(from.host, function(from_id) {
		db.get_service_id(to.host, function(to_id) {
			from.id = from_id;
			from.data = data; //Setting data if there's any
			to.id = to_id;

			if(start != null) { //When we get confirmation
				//Update trust level
				update_trust_level_block(from, to);
				//Reaching here means access was permitted
				res.send('OK');
			} else {
				console.log('authorize ...')
				//This is before the actual invocation
				authorize_access(from, to, function(status) {
					if(typeof status.data == 'undefined') {
						res.send(status.code);
					} else {
						res.send(status.code, status.data);
					}
				});
			}
			db.add_interaction(from_id, to_id, start, end);
		});
	});
};

function authorize_access(from, to, callback) {
	db.get_service_trust_level(from.id, function(f_tv) {
		db.get_service_trust_level(to.id, function(t_tv) {

			from.trust_level = f_tv;
			to.trust_level = t_tv;

			trust.authorize(from, to, callback);
		});
	});
}

function update_trust_level_block(from, to) {

	db.get_service_trust_level(from.id, function(f_tv) {
		db.get_service_trust_level(to.id, function(t_tv) {

			from.trust_level = f_tv;
			to.trust_level = t_tv;

			trust.update_block(from, to);
		});
	});
}

