var host = 'localhost';

var request = require('../../../../instr_request');
global.my_url = 'http://' + host + ':' + global.my_port;

exports.get_deal = function(req, res){
	//Call s2
	request('http://' + host + ':4104/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//Call s3
			request('http://' + host + ':4105/get_price', function (error2, response2, body2) {
				if (!error2 && response2.statusCode == 200) {
					s2 = parseInt(body);
					s3 = parseInt(body2);

					res.send('Price is : ' + (s2+s3));
				}
			});
		}
	});	
};

exports.index = function(req, res){
	res.send('S1');
};
