var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'soa_trust',
	multipleStatements: true
});
connection.connect();

exports.add_service = function(name, trust_level) {
	connection.query("INSERT INTO Service(name, trust_level) VALUES ('" + name + "'," + trust_level + ")", function(err, rows, fields) {
		if (err) throw err;
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


exports.add_interaction = function(from, to, start, end) {
	var sql = "INSERT INTO Interaction(from_service, to_service, start, end) VALUES ('" + 
		from + "','" + to  + "'," +  start  + "," + end + ")";
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
	});
}

exports.get_interactions = function(cb) {
	var sql = "SELECT f.name AS from_service, t.name AS to_service, i.start, i.end, i.ts FROM Interaction i INNER JOIN Service f ON f.id = i.from_service INNER JOIN Service t ON t.id = i.to_service;";
	connection.query(sql, function(err, rows, fields) {
		if (err) throw err;
		cb(rows);
	});	
}