var request = require('../../../../instr_request');
global.my_url = 'http://' + global.my_host + ':' + global.my_port;

exports.get_deal = function(req, res){
	//Call s2
	request('http://' + global.my_host + ':4102/get_price', function (e1, r1, b1) {
		if (!e1 && r1.statusCode == 200) {
			request('http://' + global.my_host + ':4104/get_price', function (e2, r2, b2) {
				if (!e1 && r1.statusCode == 200) {
					request('http://' + global.my_host + ':4105/get_price', function (e3, r3, b3) {
						if (!e1 && r1.statusCode == 200) {
							request('http://' + global.my_host + ':4108/get_price', function (e4, r4, b4) {
								if (!e1 && r1.statusCode == 200) {
									request('http://' + global.my_host + ':4116/get_price', function (e5, r5, b5) {
										if (!e1 && r1.statusCode == 200) {
											val = parseInt(b1) + parseInt(b2) + parseInt(b3) +
												parseInt(b4) + parseInt(b5);
											res.send('Price is : ' + val);
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
};

exports.index = function(req, res){
	res.send('S1');
};


