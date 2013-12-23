
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var scenario = require('./routes/scenario');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/scenario', scenario.show);

app.get('/service_list', routes.service_list);
app.post('/add_service_process', routes.add_service_process);
app.get('/add_service_show', routes.add_service_show);

app.get('/interaction', routes.interaction);
app.get('/interaction_list', routes.interaction_list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
