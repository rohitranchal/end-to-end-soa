var xml2js = require('xml2js');
var fs = require('fs');

var xml_file = process.argv[2];
//If input file is missing show usage and exit
if(typeof xml_file == 'undefined') {
	console.log('Missing: xml file');
	console.log('Usage: node xml2json.js <xml_file>');
	process.kill();
}

var content = fs.readFileSync(xml_file,'utf8');
var parser = new xml2js.Parser();

parser.parseString(content, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
