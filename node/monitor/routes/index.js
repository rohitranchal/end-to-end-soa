var db = require('../db');
var trust = require('../trust_algo');
url = require('url');
request = require('request');

var start_service;

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
	var stats = JSON.parse(msg);
	db.add_stat(stats.from, JSON.stringify(stats.data));
};

exports.store_inflow_data = function(msg) {
	var stats = JSON.parse(msg);

	db.add_inflow_data(stats.from, stats.data.ts, JSON.stringify(stats.data));
};


exports.hb_stats = function(req, res) {
	db.get_all_hb_items(function(rows) {
		res.render('hb/stats', {entries : rows});
	});
};

exports.hb_stat_data = function(req, res) {
	db.get_hb_item_data(req.query.id, function(data) {
		res.send(data);
	});
};

exports.hb_stats_service_view = function(req, res) {
	res.render('hb/service', {service : req.query.service});
};

exports.hb_stats_service_data = function(req, res) {
	db.get_hb_service_data(req.query.service, function(data) {
		res.send(data);
	});
};

exports.inflow_service_req_rates = function(req, res) {
	db.inflow_service_req_rates(req.query.service, function(data) {
		res.send(data);
	});
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
};

exports.toggle_service = function(req, res) {
	var svc_id = req.body.service_id;

	db.get_service(svc_id, function(val){
		var svc_status = val['status'];
		var svc_exec = 'node ../' + val['source_path'] + '/app.js';

		if (svc_status == -1) {
			var exec = require('child_process').exec;
			chld_proc = exec(svc_exec);
			chld_proc.stdout.on('data', function (data) {
			  console.log(data);
			});
			chld_proc.stderr.on('data', function (data) {
			  console.log(data);
			});
			db.set_service_status(svc_id, chld_proc.pid);
			res.redirect('/service_list');
		} else {
			try {
				process.kill(svc_status);
			} catch(e) {
				console.error(e + ' Exception: Killing process with pid: ' + svc_status);
			}
			db.set_service_status(svc_id, -1);
			res.redirect('/service_list');
		}
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

	db.get_service_data(from.host, function(from_id, from_tl, from_params) {
		db.get_service_data(to.host, function(to_id, to_tl, to_params) {

			from.id = from_id;
			from.data = data; //Setting data if there's any
			to.id = to_id;

			from.trust_level = from_tl;
			to.trust_level = to_tl;
			from.params = JSON.parse(from_params);
			to.params = JSON.parse(to_params);

			update_trust_level(from, to, i_meta);

		});
	});
};


function update_trust_level(from, to, i_meta) {
	//We are recording both the attempt of an interaction and
	//the actual interaction details.
	//when the actual interaction happens, i_meta will contain
	//a start and an end time
	if(i_meta.start_time != null) {
		//Interaction actually happened
		//Do trust levels update
		trust.update(from, to, function(f_new_tv, t_new_tv) {
			if(typeof t_new_tv == 'undefined') {
				t_new_tv = to.trust_level;
				f_new_tv = from.trust_level;
			}
			//Add interaction with metadata
			db.add_interaction(from.id, to.id, i_meta.start_time, i_meta.end_time,
				from.trust_level, to.trust_level , f_new_tv, t_new_tv);
		});
	} else {
		db.add_interaction(from.id, to.id);
	}
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

	db.get_service_data(from.host, function(from_id, from_tl, from_params) {
		db.get_service_data(to.host, function(to_id, to_tl, to_params) {
			from.id = from_id;
			from.data = data; //Setting data if there's any
			to.id = to_id;

			from.trust_level = from_tl;
			to.trust_level = to_tl;
			from.params = JSON.parse(from_params);
			to.params = JSON.parse(to_params);

			if(start != null) { //When we get confirmation
				//Update trust level
				trust.update_block(from, to);
				//Reaching here means access was permitted
				res.send('OK');
			} else {
				console.log('authorize ...')
				//This is before the actual invocation
				trust.authorize(from, to, function(status) {

					// Cannot use this because it redirects before logging and req.apply
					// Checking if headers exist, for e.g. redirect location
					// if(typeof status.headers != 'undefined') {
					// 	for(var item in status.headers) {
					// 		var header = status.headers[item];
					// 		res.setHeader(header.name, header.value);
					// 	}
					// }

					if(typeof status.data == 'undefined') {
						res.send(status.code);
					} else {
						res.send(status.code, status.data);
					}
				});
			}
			console.log('from: ' + from_id + ' to: ' + to_id + ' start: ' + start);
			db.add_interaction(from_id, to_id, start, end);
		});
	});
};

