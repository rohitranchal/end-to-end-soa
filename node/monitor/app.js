
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var scenario = require('./routes/scenario');
var trust = require('./trust_algo');
var http = require('http');
var path = require('path');
var dgram = require('dgram');

var app = express();

var passive_port = 3001;
var heartbeat_port = 3003;
var inflow_tracker_port = 3004;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
// app.use(express.logger('dev'));
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
app.get('/get_scenario_trust_levels', scenario.get_scenario_trust_levels);
app.get('/get_connection_updates', scenario.get_connection_updates);
app.get('/get_service_updates', scenario.get_service_updates);


app.get('/trust_algo_list', routes.trust_algo_list);
app.get('/get_int_authz_algo_list', routes.get_default_active_trust_algo_list);
app.get('/get_trust_algo_list', routes.get_default_trust_algo_list);
app.post('/toggle_trust_algo', routes.toggle_trust_algo);
app.get('/show_active_authz_policy', routes.show_active_authz_policy)
app.post('/try_it', routes.try_it);
app.post('/svc_action', routes.svc_action);

app.post('/toggle_service', routes.toggle_service);

//Monitor functionality related
app.get('/interaction_block', routes.interaction_block);
app.get('/interaction', routes.interaction);
app.get('/interaction_list', routes.interaction_list);
app.get('/hb_stats', routes.hb_stats);
app.get('/hb_stat_data', routes.hb_stat_data);
app.get('/hb_stats_service_view', routes.hb_stats_service_view);
app.get('/hb_stats_service_data', routes.hb_stats_service_data);
app.get('/inflow_service_req_rates', routes.inflow_service_req_rates);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////////////////////////////////////////////////////////////////
//                  Passive Listner
///////////////////////////////////////////////////////////////////////////////
var passive_server = dgram.createSocket('udp4');

passive_server.on('listening', function () {
  var address = passive_server.address();
  console.log('Passive Listener on port : ' + address.port);
});
passive_server.on('message', function (message, remote) {
	console.log(message.toString());
  routes.interaction(message.toString());
});
passive_server.bind(passive_port, '0.0.0.0');

///////////////////////////////////////////////////////////////////////////////
//                  Heartbeat Listner
///////////////////////////////////////////////////////////////////////////////
var hb_server = dgram.createSocket('udp4');

hb_server.on('listening', function () {
	var address = hb_server.address();
	console.log('Heartbeat Listener on port : ' + address.port);
});
hb_server.on('message', function (message, remote) {
	routes.store_heartbeat(message.toString());
});
hb_server.bind(heartbeat_port, '0.0.0.0');


///////////////////////////////////////////////////////////////////////////////
//                  Inflow Tracker Listner
///////////////////////////////////////////////////////////////////////////////
var inflow_data_server = dgram.createSocket('udp4');

inflow_data_server.on('listening', function () {
	var address = inflow_data_server.address();
	console.log('Inflow Tracker Listener on port : ' + address.port);
});
inflow_data_server.on('message', function (message, remote) {
	routes.store_inflow_data(message.toString());
});
inflow_data_server.bind(inflow_tracker_port, '0.0.0.0');

