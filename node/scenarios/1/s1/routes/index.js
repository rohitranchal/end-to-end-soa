var request = require('request');
var my_url = 'http://localhost:3001'

var monitor = 'http://localhost:3000/interaction'

var _req = request;

/*
 * Send given data to the monitor
 */
function sm_log(data) {

	var msg = '?';
	for(var i = 0; i < data.length; i++) {
		if(i > 0) {
			msg += '&';
		}
		msg += data[i][0] + '=' + data[i][1];
	}
	_req(monitor+msg, function(error, response, body) {
		console.log('Response from monitor : ' + body);
	});
}


request = function() {

	var sm_data = new Array();
	sm_data[0] = new Array('from', my_url);
	sm_data[1] = new Array('to', arguments[0]);
	
	sm_log(sm_data);
	
	//Do interaction
	//Note that function invocation does not wait for the SM to return a response
	var start = new Date().getTime();
	_req.apply(this, arguments);
	var end = new Date().getTime();

	sm_data[2] = new Array('start', start);
	sm_data[3] = new Array('end', end);
	sm_log(sm_data);
}


exports.get_deal = function(req, res){
	//Call s2
	request('http://localhost:3002/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			
			request('http://localhost:3003/get_price', function (error2, response2, body2) {
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
