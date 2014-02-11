var os = require('os');
var dgram = require('dgram');

var hb_interval = 3000;
var client = dgram.createSocket('udp4');

module.exports = function() {
	setInterval(function() {

		//TODO Mode data
		var stats = process.memoryUsage();

		var ts = new Date().getTime();

		var message = new Buffer(JSON.stringify(stats));
		
		client.send(message, 0, message.length, 3003, 'localhost', function(err, bytes) {
			if (err) {
				throw err;	
			}
		});

	}, hb_interval);
};