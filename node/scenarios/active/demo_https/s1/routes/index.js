var request = require('../../../../../instr_request_block');
global.my_url = 'http://' + global.my_host + ':' + global.my_port;

//To avoid the problem of using a self signed cert
//As suggested here: https://github.com/mikeal/request/issues/418
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

exports.get_deal = function(req, res){
	var cc = req.query.cc;
	//Call s2
	request('https://' + global.my_host + ':6107/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.send('Price is $' + body);
		} else {
			console.log(error);
			res.send('Internal Error: Blocked by Service Monitor : status code :' + response.statusCode);
		}
	});	
};

exports.index = function(req, res){
	res.render('index');
};
