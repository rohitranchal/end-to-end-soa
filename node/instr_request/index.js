var request = require('request');

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


module.exports = function() {

	var sm_data = new Array();
	sm_data[0] = new Array('from', global.my_url);
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