var request = require('../../../../../instr_request_block');
global.delay = 0;

exports.index = function(req, res) {

		global.my_url = 'http://' + global.my_host + ':' + global.my_port;
		request('http://' + global.my_host + ':4114/', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var val = JSON.parse(body);
				val.price += 100;
				res.send(JSON.stringify(val));
			} else {
				console.log(error);
				res.send('Internal Error: Blocked by Service Monitor : status code :' + response.statusCode);
			}
		});

};

/*
 * Mechanism to simulate a service delay due to a DoS attack
 */
exports.dos_attack = function(req, res) {
	global.delay += 1000;
	res.send('Service delay: ' + global.delay);
};



/*
 * Special casese some services and serves them faster!
 */
exports.insider_attack = function(req, res) {
	//TODO
};

