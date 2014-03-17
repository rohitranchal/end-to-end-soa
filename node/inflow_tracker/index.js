var dgram = require('dgram');

var monitor_addr = 'localhost';
if( typeof process.env.SVC_MONITOR_ADDR == 'string') {
	monitor_addr = process.env.SVC_MONITOR_ADDR;
}

var client = dgram.createSocket('udp4');

module.exports = function(request, response, next) {
	
	var stats = {};
	stats.from = global.my_host + ':' + global.my_port;
	
	//data
	stats.data = {};
	stats.data.ts = new Date().getTime();
	stats.data.url = request.url;
	stats.data.headers = request.headers;
	var message = new Buffer(JSON.stringify(stats));
	//TODO

	client.send(message, 0, message.length, 3004, monitor_addr, function(err, bytes) {
		//Nothing to do
	});

	next();
};
