var fs = require('fs');
var hb = require('../../../heartbeat');

global.my_port = 4101;
global.my_host = 'localhost';

//Override hostname
if(fs.existsSync('host')) {
	fs.readSync('host', 'utf8', function (err,data) {
		global.my_host = data;
	});
}

//Start heartbeat
hb();


var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var request = require('request');
global.my_url = 'http://' + global.my_host + ':' + global.my_port;

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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var get_deal = function(req, res){
	//Call s2
	request('http://' + global.my_host + ':4102/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//Add 3000 and respond
			body =  parseInt(body) + 3000;
			res.send('Price is : ' + body);
		}
	});
};

var ind = function(req, res){
	res.send('S1');
};



app.get('/', ind);
app.get('/get_deal', get_deal);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
