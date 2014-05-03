var request = require('request');
var dgram = require('dgram');


var monitor_addr = 'localhost';
if( typeof process.env.SVC_MONITOR_ADDR == 'string') {
	monitor_addr = process.env.SVC_MONITOR_ADDR;
}


var monitor = 'http://' + monitor_addr + ':3000/interaction'
var _req = request;
var client = dgram.createSocket('udp4');
/*
 * Send given data to the monitor
 */
function sm_log(data) {

	var msg = new Buffer(JSON.stringify(data));

	client.send(msg, 0, msg.length, 3001, 'localhost', function(err, bytes) {
		if (err) {
			throw err;
		}
	});
}


module.exports = function() {

	var sm_data = {};
	sm_data.from = global.my_url;
	sm_data.to = arguments[0];

	sm_log(sm_data);

	//Do interaction
	//Note that function invocation does not wait for the SM to return a response
	var start = new Date().getTime();

	var cb = arguments[1];//Backup callback
	var profiling_cb = function (error, response, body) {
		var end = new Date().getTime();
		cb(error, response, body); //Fire off the callback

		sm_data.start = start;
		sm_data.end = end;
		global.eval_interaction(sm_data.to, start, end, function(service_feedback) {
			sm_data.service_feedback = service_feedback;
			console.log(sm_data);
			//this is async
			sm_log(sm_data);	
		});
		
	};

	arguments[1] = profiling_cb;
	_req.apply(this, arguments);

};

