exports.index = function(req, res){
  res.send('S2');
};


exports.get_price = function(req, res){
	setTimeout(function() {
		res.send('2311');
	}, 0);
};
