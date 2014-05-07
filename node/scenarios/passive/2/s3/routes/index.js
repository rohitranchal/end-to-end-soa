exports.index = function(req, res){
  res.send('S3');
};


exports.get_price = function(req, res){
  res.send(JSON.stringify(20));
};
