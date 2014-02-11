var db = require('../../db');
var java = require('java');
var xml2js = require('xml2js');
var fs = require('fs');
var uuid = require('node-uuid');

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
var text = fs.readFileSync(active_dir + 'request_templates/req_adblock.json','utf8');
var req_template = JSON.parse(text);

var policy_text = fs.readFileSync(active_dir + 'policies/policy_adblock.xml','utf8');

var AccessController = java.import('edu.purdue.cs.endtoendsoa.AccessController');
var ac = new AccessController();


var trust = function none(from, to, cb) {
	//Nothing to do!
};

var auth = function(from, to, id, cb) {

	//Make a copy of req_template
	var req = JSON.parse(JSON.stringify(req_template));

	//Update obj with incoming parameters
	for(var i in req.Request.Attributes) {
		var attr = req.Request.Attributes[i];
		var attr_id = attr.Attribute[0].$.AttributeId;
		var category = attr.$.Category;
		if(attr_id == 'urn:oasis:names:tc:xacml:1.0:resource:resource-id') {
			attr.Attribute[0].AttributeValue[0]._=to.host;
		} else if(attr_id == 'http://endtoendsoa.cs.purdue.edu/policy/service_uri') {
			attr.Attribute[0].AttributeValue[0]._=from.host;
		} else if(attr_id == 'urn:oasis:names:tc:xacml:1.0:action:action-id') {
			attr.Attribute[0].AttributeValue[0]._='READ';
		} else if(category == 'urn:oasis:names:tc:xacml:3.0:attribute-category:environment') {
			for(var j in attr.Attribute) {
				var attr_id1 = attr.Attribute[j].$.AttributeId;
				if(attr_id1 == 'http://endtoendsoa.cs.purdue.edu/policy/trust_level') {
					attr.Attribute[j].AttributeValue[0]._=to.trust_level;
				} else if(attr_id1 == 'http://endtoendsoa.cs.purdue.edu/policy/operation') {
					attr.Attribute[j].AttributeValue[0]._=to.href;
				}
			}
		}
	}

	var builder = new xml2js.Builder();
	var req_xml = builder.buildObject(req);

	console.log(req_xml);
	
	//Write policy to a tmp file
	var tmp_policy_file = '/tmp/' + uuid.v4();
	fs.writeFileSync(tmp_policy_file, policy_text);
	console.log(tmp_policy_file);

	ac.evaluate(tmp_policy_file, req_xml, function(err, result) {
		if(err) {
			console.log(err);
		} else {
			console.log('Authorization response: ' + result);
			if(result == 'Permit') {
				cb(id, {code : 200});
			} else {
				cb(id, {code : 403});
			}
		}
	});
};

module.exports = {name :'XACML-Policy : Remote Ad Block', alg : trust, authorize : auth, policy : policy_text};
