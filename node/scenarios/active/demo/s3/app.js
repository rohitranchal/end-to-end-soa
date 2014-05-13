
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

global.my_port = 4111;
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
		feedback.satisfaction = 0.7

	} else {

		//If more than 1s
		feedback.satisfaction = 0.2

	}

	feedback.weight = 1;

	results(feedback);
};

// all environments
app.set('port', process.env.PORT || global.my_port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/attack_transport', routes.attack_transport);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
