
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

global.my_host = 'localhost';
global.my_port = 4109;

//Evaluate interactions
global.eval_interaction = function(target, start, end, results) {
	var feedback = {};
	var time = end - start;

	if(time < 1000) {

		feedback.satisfaction = 1;

	} else if(time > 1000 & time < 2000) {

		feedback.satisfaction = 0.5

	} else {

		feedback.satisfaction = 0.1

	}

	feedback.weight = 1;
	console.log(target + '>' + time + ':' + feedback.satisfaction);
	results(feedback);
};

// all environments
app.set('port', process.env.PORT || global.my_port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
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


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
