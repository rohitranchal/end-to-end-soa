var request = require('../../../../../instr_request_block');
global.my_url = 'http://' + global.my_host + ':' + global.my_port;

exports.get_deal = function(req, res){
	//Call s2
	request('http://' + global.my_host + ':6104/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//Call s3
			request('http://' + global.my_host + ':6105/get_advertisement', function (error2, response2, body2) {
				if (!error2 && response2.statusCode == 200) {
					s2 = parseInt(body);
					var adv = body2;

					res.send('Price is $' + s2 + '          \n' + adv);
				} else {
					res.send('Internal Error: Blocked by Service Monitor : status code :' + response2.statusCode);
				}
			});
		} else {
			res.send('Internal Error: Blocked by Service Monitor : status code :' + response.statusCode);
		}
	});	
};

exports.index = function(req, res){
	res.render('index');
};
