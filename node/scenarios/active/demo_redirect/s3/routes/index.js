exports.index = function(req, res){
	res.send('S3');
};


exports.get_price = function(req, res){
  // backup service is expensive
	res.send('7000');
};
