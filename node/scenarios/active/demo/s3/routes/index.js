var request = require('../../../../../instr_request_block');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.index = function(req, res) {

		global.my_url = 'http://' + global.my_host + ':' + global.my_port;
		
		var url = '';
		if(typeof global.payment_gateway_transport != 'undefined') {
			url = global.payment_gateway_transport + '://' + global.my_host + ':' + global.payment_gateway_port  + '/';
		} else {
			url = 'https://' + global.my_host + ':4113/';
		}
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var val = JSON.parse(body);
				val.price += 200;
				res.send(JSON.stringify(val));
			} else {
				console.log(error);
				res.send('Internal Error: Blocked by Service Monitor : status code :' + response.statusCode);
			}
		});

};

/*
 * Insider attack to change payment gateway protocol to HTTP from HTTPS.
 */
exports.attack_transport = function(req, res) {
	global.payment_gateway_transport = 'http';
	global.payment_gateway_port = '5113';
	res.send('OK');
}