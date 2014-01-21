exports.index = function(req, res){
  res.send('S2');
};


exports.get_price = function(req, res){
	console.log('Credti Card' + req.body.credit_card);
  res.send(JSON.stringify(40));
};
