var db = require('../../db');
var java = require('java');

//Java dependancies
var jars_dir = process.cwd() + '/lib/';
console.log(jars_dir);
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

var AccessController = java.import('edu.purdue.cs.endtoendsoa.AccessController');
var ac = new AccessController(process.cwd() + "/trust_algo/active/policies/");


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
	//TODO
	if(to.trust_level < from.trust_level) {
		cb(0);
	} else {
		cb(1);
	}
};

module.exports = {name :'Simple Blocking Trust', alg : simple_trust, authorize : simple_auth};