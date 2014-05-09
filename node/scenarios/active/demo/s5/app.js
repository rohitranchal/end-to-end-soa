
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

global.my_port = 4113;
global.my_host = 'localhost';

var req_delay = function(request, response, next) {
	
	//Delay request by the set number of miliseconds
	console.log(global.my_host + ":" + global.my_port + " > delay: " + global.delay)
	setTimeout(function() {
		next();	
	},global.delay);
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
