var request = require('../../../../../instr_request_block');
global.my_url = 'http://' + global.my_host + ':' + global.my_port;

exports.index = function(req, res){
	global.my_url = 'http://' + global.my_host + ':' + global.my_port;
	request('http://' + global.my_host + ':4110/?cc=4330123445678944', function (error1, response1, body1) {
		if(error1 !== null) {
			res.send(error1);
		} else {
			request('http://' + global.my_host + ':4111/?cc=4330123445678944', function (error2, response2, body2) {
				if(error2 !== null) {
					res.send(error2);
				} else {
					request('http://' + global.my_host + ':4112/?cc=4330123445678944', function (error3, response3, body3) {
						if(error3 !== null) {
							res.send(error3);
						} else {
							var s2 = JSON.parse(body1);
							var s3 = JSON.parse(body2);
							var s4 = JSON.parse(body3);

							var r = {'Car Rental' : s2.price, 'Hotel' : s3.price, 'Airline' : s4.price};
							res.send(r);
						}
					});					
				}

			});			
		}

	});

};