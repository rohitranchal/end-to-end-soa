var request = require('request');
var Q = require('q');

var monitor = 'http://localhost:3000/interaction_block'
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
		return body;
	});
}


module.exports = function() {

	var sm_data = new Array();
	sm_data[0] = new Array('from', global.my_url);
	sm_data[1] = new Array('to', arguments[0]);
	
	Q(sm_log(sm_data)).then(function(status) {
		if(status == 'OK') {
			var start = new Date().getTime();
			_req.apply(this, arguments);
			var end = new Date().getTime();

			sm_data[2] = new Array('start', start);
			sm_data[3] = new Array('end', end);
			sm_log(sm_data);
		} else {
			//Block
			arguments[1]('Request Blocked');
		}

	});
	

}
