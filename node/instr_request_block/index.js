var request = require('request');

var monitor = 'http://localhost:3000/interaction_block'
var _req = request;
/*
 * Send given data to the monitor
 */
function sm_log(data, callback) {

	var msg = '?';
	for(var i = 0; i < data.length; i++) {
		if(i > 0) {
			msg += '&';
		}
		msg += data[i][0] + '=' + data[i][1];
	}
	console.log('calling :' + monitor+msg);

	_req(monitor+msg, function(error, response, body) {
		if(typeof callback != 'undefined') {
			callback(error, response, body);	
		}
	});
}


module.exports = function() {

	var sm_data = new Array();
	sm_data[0] = new Array('from', global.my_url);
	sm_data[1] = new Array('to', arguments[0]);
	
	var _args = arguments;
	var _this = this;
	sm_log(sm_data, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var start = new Date().getTime();
			_req.apply(_this, _args);
			var end = new Date().getTime();

			sm_data[2] = new Array('start', start);
			sm_data[3] = new Array('end', end);
			sm_log(sm_data); //We don't care about the result here
		} else {
			_args[1](error, response, body);
			return;
		}

	});
	

}
