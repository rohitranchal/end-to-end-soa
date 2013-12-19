var request = require('../../../../instr_request');
global.my_url = 'http://localhost:3002';


exports.index = function(req, res){
  res.send('S2');
};


exports.get_price = function(req, res){
	request('http://localhost:3003/get_price', function (error2, response2, body2) {
		if (!error2 && response2.statusCode == 200) {
			val = parseInt(body2) + 4000;
			res.send(JSON.stringify(val));
		}
	});

  
};