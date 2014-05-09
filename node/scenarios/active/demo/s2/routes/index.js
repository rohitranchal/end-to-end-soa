var request = require('../../../../../instr_request_block');

exports.index = function(req, res) {

		global.my_url = 'http://' + global.my_host + ':' + global.my_port;
		request('http://' + global.my_host + ':4113/', function (error, response, body) {
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