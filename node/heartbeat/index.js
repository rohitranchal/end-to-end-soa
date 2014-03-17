var os = require('os');
var dgram = require('dgram');

var hb_interval = 3000;
var client = dgram.createSocket('udp4');

var monitor_addr = 'localhost';
if( typeof process.env.SVC_MONITOR_ADDR == 'string') {
	monitor_addr = process.env.SVC_MONITOR_ADDR;
	console.log('Found : ' + monitor_addr);
}


module.exports = function() {
	setInterval(function() {

		var stats = {};
		stats.from = global.my_host + ':' + global.my_port;

		//data
		stats.data = {};
		stats.data.ts = new Date().getTime();
		stats.data.process = {};
		stats.data.process.memoryUsage = process.memoryUsage();
		stats.data.process.pid = process.pid;
		stats.data.process.platform = process.platform;
		stats.data.process.title = process.title;
		stats.data.process.arch = process.arch;
		stats.data.process.config = process.config;
		stats.data.process.env = process.env;
		stats.data.process.uptime = process.uptime();
		stats.data.process.hrtime = process.hrtime();
		stats.data.process.execPath = process.execPath;
		stats.data.process.execArgv = process.execArgv;
		stats.data.process.argv = process.argv;
		
		var message = new Buffer(JSON.stringify(stats));
		
		client.send(message, 0, message.length, 3003, monitor_addr, function(err, bytes) {
			if (err) {
				throw err;	
			}
		});


	}, hb_interval);
};