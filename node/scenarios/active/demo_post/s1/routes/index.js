var request = require('../../../../../instr_request_block');
global.my_url = 'http://' + global.my_host + ':' + global.my_port;

exports.get_deal = function(req, res){
	var cc = req.query.cc;
	//Call s2
	request.post('http://' + global.my_host + ':6109/get_price',  { form: { credit_card: cc } }, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			res.send('Price is $' + body);
		} else {
			res.send('Internal Error: Blocked by Service Monitor : status code :' + response.statusCode);
		}
	});	
};

exports.index = function(req, res){
	res.render('index');
};
