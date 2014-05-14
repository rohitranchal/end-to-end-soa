var fs = require('fs');

var express = require('express');
var routes = require('./routes');
var http = require('http');
var https = require('https');
var path = require('path');

var app = express();

global.my_port = 4113;
global.my_host = 'localhost';

//Evaluate interactions
global.eval_interaction = function(target, start, end, results) {
  var feedback = {};
  var time = end - start;

  if(time < 100) {

	//If less than 100ms
	feedback.satisfaction = 1;

  } else if(time > 100 & time < 1000) {

	//If within 100ms and 1s
	feedback.satisfaction = 0.5

  } else {

	//If more than 1s
	feedback.satisfaction = 0.1

  }

  feedback.weight = 1;

  results(feedback);
};

var req_delay = function(request, response, next) {

	if(request.url == '/dos_attack') {

		//Do not delay attack simulation requests
		next();

	} else {

		//Delay request by the set number of miliseconds
		console.log(global.my_host + ":" + global.my_port + " > delay: " + global.delay)
		setTimeout(function() {
			next();
		},global.delay);

	}
};


// all environments
app.set('port', process.env.PORT || global.my_port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(req_delay);
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/dos_attack', routes.dos_attack);

http.createServer(app).listen(app.get('port') + 1000, function(){
  console.log('Express server listening on port ' + (app.get('port') + 1000));
});

//To be able to start from the monitor
var key_path_prefix = '../scenarios/active/demo/s5/';

var private_key = fs.readFileSync(key_path_prefix + './keys/privatekey.pem').toString();
var certificate = fs.readFileSync(key_path_prefix + './keys/certificate.pem').toString();

var credentials = {key: private_key, cert: certificate};

https.createServer(credentials, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
