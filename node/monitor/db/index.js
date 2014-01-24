var mysql      = require('mysql');
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


exports.get_service_id = function(name, cb) {
	connection.query("SELECT id FROM Service WHERE name='" + name + "'", function(err, rows, fields) {
		if (err) throw err;
		cb(rows[0].id);
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


exports.add_interaction = function(from, to, start, end, from_pre, to_pre, from_post, to_post) {

	if(typeof start == 'undefined') {
		start = null;
	}

	if(typeof end == 'undefined') {
		end = null;
	}

	if(typeof from_pre == 'undefined') {
		from_pre = null;
	}

	if(typeof to_pre == 'undefined') {
		to_pre = null;
	}

	if(typeof from_post == 'undefined') {
		from_post = null;
	}

	if(typeof to_post == 'undefined') {
		to_post = null;
	}

	var sql = "INSERT INTO Interaction(from_service, to_service, start, end," +
					"from_service_trust_level_pre, to_service_trust_level_pre, from_service_trust_level_post, " +
					"to_service_trust_level_post) " +
				"VALUES ('" + 
					from + "','" + to  + "'," +  start  + "," + end + "," + 
					from_pre + "," + to_pre + "," + from_post + "," + to_post + ")";
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.get_interactions = function(cb) {
	var sql = "SELECT f.name AS from_service, t.name AS to_service, i.start, i.end, i.ts " +
			"FROM Interaction i INNER JOIN Service f ON f.id = i.from_service INNER JOIN Service t ON t.id = i.to_service;";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});	
}