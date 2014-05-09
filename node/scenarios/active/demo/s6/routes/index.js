exports.index = function(req, res){
	var values = {'price' : 350};
	res.send(JSON.stringify(values));
};