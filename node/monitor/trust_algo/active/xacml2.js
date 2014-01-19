var db = require('../../db');
var java = require('java');
var xml2js = require('xml2js');
var fs = require('fs');

//Java dependancies
var jars_dir = process.cwd() + '/lib/';
java.classpath.push(jars_dir + "apache-mime4j-core-0.7.2.jar");
java.classpath.push(jars_dir + "balana-distribution-1.0.0-wso2v7.jar");
java.classpath.push(jars_dir + "geronimo-activation_1.1_spec-1.1.jar");
java.classpath.push(jars_dir + "jaxen-1.1.3.jar");
java.classpath.push(jars_dir + "wstx-asl-3.2.9.jar");
java.classpath.push(jars_dir + "axiom-api-1.2.13.jar");
java.classpath.push(jars_dir + "commons-io-1.3.2.jar");
java.classpath.push(jars_dir + "geronimo-javamail_1.4_spec-1.7.1.jar");
java.classpath.push(jars_dir + "junit-3.8.1.jar");
java.classpath.push(jars_dir + "axiom-impl-1.2.13.jar");
java.classpath.push(jars_dir + "commons-logging-1.1.1.jar");
java.classpath.push(jars_dir + "geronimo-stax-api_1.0_spec-1.0.1.jar");
java.classpath.push(jars_dir + "org.wso2.balana-1.0.0-wso2v7.jar");
java.classpath.push(jars_dir + "policy-1.0-SNAPSHOT.jar");


var active_dir = process.cwd() + '/trust_algo/active/';
var text = fs.readFileSync(active_dir + 'request_templates/req_time.json','utf8');
var req_template = JSON.parse(text);

var policy_text = fs.readFileSync(active_dir + 'policies/policy_time.xml','utf8');

var AccessController = java.import('edu.purdue.cs.endtoendsoa.AccessController');
var ac = new AccessController();


var trust = function none(from, to, cb) {
	//Nothing to do!
};

var auth = function(from, to, cb) {

	//Make a copy of req_template
	var req = JSON.parse(JSON.stringify(req_template));
	
	//Update obj with incoming parameters
	for(var i in req.Request.Attributes) {
		var attr = req.Request.Attributes[i];
		var attr_id = attr.Attribute[0].$.AttributeId;
		if(attr_id == 'urn:oasis:names:tc:xacml:1.0:resource:resource-id') {
			attr.Attribute[0].AttributeValue[0]._=to.host;
		} else if(attr_id == 'http://endtoendsoa.cs.purdue.edu/policy/service_uri') {
			attr.Attribute[0].AttributeValue[0]._=from.host;
		} else if(attr_id == 'urn:oasis:names:tc:xacml:1.0:action:action-id') {
			attr.Attribute[0].AttributeValue[0]._='READ';
		} else if(attr_id == 'urn:oasis:names:tc:xacml:1.0:environment:current-time') {
			var date = new Date();
			var hour = date.getHours();
			hour = (hour < 10 ? "0" : "") + hour;
			var min  = date.getMinutes();
			min = (min < 10 ? "0" : "") + min;
			var sec  = date.getSeconds();
			sec = (sec < 10 ? "0" : "") + sec;

			attr.Attribute[0].AttributeValue[0]._=hour + ':' + min + ':' + sec;
		}
	}

	var builder = new xml2js.Builder();
	var req_xml = builder.buildObject(req);
	ac.evaluate(active_dir + 'policies/policy_time.xml', req_xml, function(err, result) {
		if(err) {
			console.log(err);
		} else {
			console.log('Authorization response: ' + result);
			if(result == 'Permit') {
				cb(1);
			} else {
				cb(0);
			}
		}
	});
};

module.exports = {name :'XACML-Policy : Time Based', alg : trust, authorize : auth, policy : policy_text};
