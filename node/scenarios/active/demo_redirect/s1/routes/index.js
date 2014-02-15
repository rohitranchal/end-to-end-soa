var request = require('../../../../../instr_request_block');
global.my_url = 'http://' + global.my_host + ':' + global.my_port;
global.to_service_name = global.my_host + ':6111';

exports.get_deal = function(req, res) {
	//Call s2
	request('http://' + global.my_host + ':6111/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//Add 3000 and respond
			body =  parseInt(body) + 3000;
			res.send('Price is : ' + body);
		} else {
			res.send('Internal Error: Service: http://' + global.my_host + ':6111/get_price unavailable!');
		}
	});
};

exports.index = function(req, res){
	res.render('index');
};
