var request = require('../../../../instr_request');
global.my_url = 'http://' + global.my_host + ':' + global.my_port;

exports.get_deal = function(req, res){
	//Call s2
	request('http://' + global.my_host + ':4107/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			val = parseInt(body) + 10000;
			res.send('Price is : ' + val);
		}
	});	
};

exports.index = function(req, res){
	res.send('S1');
};
