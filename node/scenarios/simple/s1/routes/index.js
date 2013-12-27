var host = 'localhost';

var request = require('../../../../instr_request');
global.my_url = 'http://' + host + ':4101';

exports.get_deal = function(req, res){
	//Call s2
	request('http://' + host + ':4102/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//Add 3000 and respond
			body =  parseInt(body) + 3000;
			res.send('Price is : ' + body);
		}
	});	
};

exports.index = function(req, res){
	res.send('S1');
};
