var fs = require('fs');

global.my_port = 6101;
global.my_host = 'localhost';

//Override hostname
fs.readFile('../../../host', 'utf8', function (err,data) {
	global.my_host = data;
});

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

var request = require('../../../../instr_request_block');
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
	request('http://' + global.my_host + ':6102/get_price', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			//Add 3000 and respond
			body =  parseInt(body) + 3000;
			res.send('Price is : ' + body);
		} else {
			// console.log("ERROR: " + error);
			// console.log("STATUS: " + response.statusCode);
			res.send('Internal Error: request to http://' + global.my_host + ':6102/get_price blocked!');
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
