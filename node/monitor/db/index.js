var mysql      = require('mysql');
var uuid			 = require('node-uuid');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'soa_trust',
	multipleStatements: true
});
connection.connect();


/*
 * Returns the set of services that called the given
 */
exports.get_caller_services = function(service, cb) {
	var sql = 'SELECT id, trust_level from Service WHERE ID IN (SELECT DISTINCT from_service FROM Interaction WHERE to_service=' + service + ')';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_services_of_scenario = function(services, cb) {
	var sql = 'SELECT * FROM Service WHERE id IN (' + services + ')';
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.add_service = function(name, trust_level) {
	connection.query("INSERT INTO Service(name, trust_level) VALUES ('" + name + "'," + trust_level + ")", function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.get_service = function(id, cb) {
	connection.query("SELECT * FROM Service WHERE id =" + id, function(err, rows, fields) {
		if (err) throw err;
		if(rows.length > 0) {
			cb(rows[0]);
		} else {
			cb(null);
		}

	});
}

exports.get_services = function(cb) {
	connection.query('SELECT * FROM Service', function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_service_data = function(name, cb) {
	connection.query("SELECT id, trust_level, params FROM Service WHERE name='" + name + "'", function(err, rows, fields) {
		if (err) throw err;
		cb(rows[0].id, rows[0].trust_level, rows[0].params);
	});
}

exports.reset_trust_levels = function(value) {
	connection.query("UPDATE Service SET trust_level = " + value, function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.update_service_params = function(sid, val, done) {
	var sql = "UPDATE Service SET params ='" + val + "' WHERE id=" + sid;
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		done();
	});
}

exports.get_service_trust_level = function(id, cb) {
	connection.query("SELECT trust_level FROM Service WHERE id=" + id, function(err, rows, fields) {
		if (err) throw err;
		cb(rows[0].trust_level);
	});
}

exports.set_service_trust_level = function(id, trust_level) {
	connection.query("UPDATE Service SET trust_level= " + trust_level + " WHERE id=" + id, function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.set_service_status = function(id, status_val) {
	connection.query("UPDATE Service SET status= " + status_val + " WHERE id=" + id, function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.add_interaction = function(from, to, start, end, data, feedback, cb) {

	if(typeof from == 'undefined') {
		from = null;
	}

	if(typeof to == 'undefined') {
		to = null;
	}

	if(typeof start == 'undefined') {
		start = null;
	}

	if(typeof end == 'undefined') {
		end = null;
	}

	if(typeof data == 'undefined') {
		data = null;
	}

	if(typeof feedback == 'undefined') {
		feedback = null;
	}

	var interaction_id = uuid.v4();

	var sql = "INSERT INTO Interaction(id, from_service, to_service, start, end," +
					"data, feedback) " +
				"VALUES ('" +
					interaction_id + "','" + from + "','" + to  + "'," +  start  + "," + end + ",'" +
					data + "','" + feedback + "')";
	console.log("\n\n\n" + sql + "\n\n\n");
	connection.query(sql, function(err, rows, fields) {
		if (err) {
			throw err;
		} else {

			// get interaction id here
			cb(interaction_id);
		}
	});
}

exports.get_interactions = function(cb) {
	var sql = "SELECT f.name AS from_service, t.name AS to_service, i.start, i.end, (i.end - i.start) AS duration, i.ts, i.to_service_trust_level_post, i.from_service_trust_level_pre , i.to_service_trust_level_pre , i.from_service_trust_level_post , i.to_service_trust_level_post " +
			"FROM Interaction i INNER JOIN Service f ON f.id = i.from_service INNER JOIN Service t ON t.id = i.to_service;";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.add_stat = function(service, data) {

	var sql = "INSERT INTO Heartbeat_Data(service, data) " +
				"VALUES ('" + service + "','" + data  + "')";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.add_inflow_data = function(service, request_ts, from_ip, protocol, data) {

	var sql = "INSERT INTO Inflow_Data(service, request_ts, from_ip, protocol, data) " +
				"VALUES ('" + service + "','" + request_ts + "','" + from_ip + "','" + protocol + "','" + data  + "')";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
	});
}


exports.get_all_hb_items = function(cb) {
	var sql = "SELECT id, ts, service FROM Heartbeat_Data";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_hb_item_data = function(id, cb) {
	var sql = "SELECT * FROM Heartbeat_Data WHERE id=" + id;
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.get_hb_service_data = function(service, cb) {
	var sql = "SELECT * FROM Heartbeat_Data WHERE service='" + service + "'";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}

exports.inflow_service_req_rates = function(service, cb) {
	var sql = "SELECT request_ts DIV 1000 as second, COUNT(*) as count" +
				" FROM Inflow_Data " +
				" WHERE service='" + service + "'" +
				" GROUP BY request_ts DIV 1000 " +
				" ORDER BY request_ts DIV 1000 DESC LIMIT 20";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});
}
