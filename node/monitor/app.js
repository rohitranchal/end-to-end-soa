
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var scenario = require('./routes/scenario');
var trust = require('./trust_algo');
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
app.use(express.json());
app.use(express.urlencoded());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Demo related
app.get('/', routes.index);
app.get('/scenario_list', scenario.show_all);
app.get('/scenario', scenario.show);
app.get('/scenario_topology', scenario.get_topology);
app.get('/service_list', routes.service_list);
app.get('/service', routes.service);
app.post('/update_service_params', routes.update_service_params);
app.post('/add_service_process', routes.add_service_process);
app.get('/add_service_show', routes.add_service_show);


app.post('/update_service_tl', routes.set_trust_levels);
app.get('/reset_trust_values', routes.trust_values_reset);
app.get('/trust_algo_list', routes.trust_algo_list);
app.get('/get_default_trust_algo', routes.get_default_trust_algo);
app.post('/set_default_trust_algo', routes.set_default_trust_algo);

app.post('/try_it', routes.try_it);

//Monitor functionality related
app.get('/interaction_block', routes.interaction_block);
app.get('/interaction', routes.interaction);
app.get('/interaction_list', routes.interaction_list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
