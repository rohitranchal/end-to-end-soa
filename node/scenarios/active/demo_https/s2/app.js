var fs = require('fs');
const crypto = require('crypto');


global.my_port = 6107;
global.my_host = 'localhost';

//Override hostname
fs.readFile('../../../host', 'utf8', function (err,data) {
	global.my_host = data;
});

var private_key = fs.readFileSync('./keys/privatekey.pem').toString();
var certificate = fs.readFileSync('./keys/certificate.pem').toString();

var credentials = {key: private_key, cert: certificate};


var express = require('express');
var routes = require('./routes');
var https = require('https');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || global.my_port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/get_price', routes.get_price);


https.createServer(credentials, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
