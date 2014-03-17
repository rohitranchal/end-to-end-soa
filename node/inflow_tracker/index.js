var dgram = require('dgram');

var client = dgram.createSocket('udp4');

module.exports = function(request, response, next) {
	
	var stats = {};
	stats.from = global.my_host + ':' + global.my_port;
	
	//data
	stats.data = {};
	stats.data.url = request.url;
	var message = new Buffer(JSON.stringify(stats));
	//TODO

	client.send(message, 0, message.length, 3004, 'localhost', function(err, bytes) {
		//Nothing to do
	});

	next();
};
