var request = require('request');


var monitor_addr = 'localhost';
if( typeof process.env.SVC_MONITOR_ADDR == 'string') {
	monitor_addr = process.env.SVC_MONITOR_ADDR;
}


var monitor = 'http://' + monitor_addr + ':3000/interaction_block'
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
		console.log('Resp: ' + body);
		if(typeof callback != 'undefined') {
			callback(error, response, body);
		}
	});
}

var my_req = function() {

	var sm_data = new Array();
	sm_data[0] = new Array('from', global.my_url);
	sm_data[1] = new Array('to', arguments[0]);

	var _args = arguments;
	var _this = this;
	sm_log(sm_data, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			if(body != 'OK') {
				_args[0] = body;
				sm_data[1] = new Array('to', body);
			}
			var start = new Date().getTime();
			_req.apply(_this, _args);
			var end = new Date().getTime();

			sm_data[2] = new Array('start', start);
			sm_data[3] = new Array('end', end);
			console.log('log data: ' + JSON.stringify(sm_data));
			sm_log(sm_data); //We don't care about the result here
		} else {
			_args[1](error, response, body);
			return;
		}

	});
};

my_req.post = function() {
	var sm_data = new Array();
	sm_data[sm_data.length] = new Array('from', global.my_url);
	sm_data[sm_data.length] = new Array('to', arguments[0]);
	sm_data[sm_data.length] = new Array('data', JSON.stringify(arguments[1]));

	var _args = arguments;
	var _this = this;
	sm_log(sm_data, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			var start = new Date().getTime();
			_req.post(_args[0], _args[1], _args[2]);
			var end = new Date().getTime();

			sm_data[sm_data.length] = new Array('start', start);
			sm_data[sm_data.length] = new Array('end', end);
			sm_log(sm_data); //We don't care about the result here
		} else {
			_args[2](error, response, body);
			return;
		}

	});
};


module.exports = my_req;
