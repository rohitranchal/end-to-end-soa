exports.index = function(req, res){
  res.send('S2');
};


exports.get_price = function(req, res){
  res.send(JSON.stringify(40));
};
