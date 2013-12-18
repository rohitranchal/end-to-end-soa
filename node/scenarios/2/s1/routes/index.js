var request = require('../../../../instr_request');
global.my_url = 'http://localhost:3001';

exports.get_deal = function(req, res){
	//Call s2
	request('http://localhost:3002/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('REACHED');
			val = parseInt(body) + 10000;
			res.send('Price is : ' + val);
		}
	});	
};

exports.index = function(req, res){
	res.send('S1');
};
