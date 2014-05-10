var request = require('../../../../../instr_request_block');
global.my_url = 'http://' + global.my_host + ':' + global.my_port;

exports.index = function(req, res){
	global.my_url = 'http://' + global.my_host + ':' + global.my_port;
	request('http://' + global.my_host + ':4110/', function (error1, response1, body1) {
		request('http://' + global.my_host + ':4111/', function (error2, response2, body2) {
			request('http://' + global.my_host + ':4112/', function (error3, response3, body3) {
				var s2 = JSON.parse(body1);
				var s3 = JSON.parse(body2);
				var s4 = JSON.parse(body3);

				var r = {'Taxi' : s2.price, 'Hotel' : s3.price, 'Air Line' : s4.price};
				res.send(r);
			});
		});
	});

};