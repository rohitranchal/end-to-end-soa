var request = require('../../../../../instr_request_block');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.index = function(req, res) {

		global.my_url = 'http://' + global.my_host + ':' + global.my_port;
		request('https://' + global.my_host + ':4113/', function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var val = JSON.parse(body);
				val.price += 1000;
				res.send(JSON.stringify(val));
			} else {
				console.log(error);
				res.send('Internal Error: Blocked by Service Monitor : status code :' + response.statusCode);
			}
		});

};