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
var text = fs.readFileSync(active_dir + 'request_templates/req_1.json','utf8');
var req_template = JSON.parse(text);

var policy_text = fs.readFileSync(active_dir + 'policies/policy_1.xml','utf8');

var AccessController = java.import('edu.purdue.cs.endtoendsoa.AccessController');
var ac = new AccessController();


var simple_trust = function simple_trust_update(from, to, cb) {
	if(from.trust_level != 0) {
		var new_trust_level = from.trust_level * to.trust_level/from.trust_level;
		db.set_service_trust_level(from.id, new_trust_level);
		if(typeof cb != 'undefined') {
			cb(new_trust_level);
		}
	}
};

var simple_auth = function(from, to, cb) {

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
		} else if(attr_id == 'http://test.org/trust_level') {
			attr.Attribute[0].AttributeValue[0]._=to.trust_level;
		}
	}

	var builder = new xml2js.Builder();
	var req_xml = builder.buildObject(req);
	ac.evaluate(active_dir + 'policies/policy_1.xml', req_xml, function(err, result) {
		if(err) {
			console.log(err);
		} else {
			if(result == 'Permit') {
				cb(1);
			} else {
				cb(0);
			}
		}
	});
};

module.exports = {name :'XACML-Policy : 1', alg : simple_trust, authorize : simple_auth, policy : policy_text};

/**
Resource: Target service 
User: Service invoking the target service
Action: Always READ
Environment: 
	- trust levels of the user and the resource
	- Certain times of day the access is not allowed
	- Certain load levels at which access is not allowed

*/