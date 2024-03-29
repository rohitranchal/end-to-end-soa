package edu.purdue.cs.endtoendsoa;

import java.io.File;
import java.net.URL;

import junit.framework.TestCase;

import org.apache.commons.io.FileUtils;

public class TestAccessController extends TestCase {

	public void testEvaluate() throws Exception {

		URL policiesPath = getClass().getClassLoader().getResource("policies/sample_policy.xml");
		URL reqPath = getClass().getClassLoader().getResource("req1.xml");
		
		AccessController controller = new AccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
	}
	
	public void testEvaluateServicePolicy() throws Exception {
		URL policiesPath = getClass().getClassLoader().getResource("policies/policy.xml");
		URL reqPath = getClass().getClassLoader().getResource("req2.xml");
		
		AccessController controller = new AccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
		
		reqPath = getClass().getClassLoader().getResource("req2.1.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Deny", res);
	}
	
	public void testEvaluateServiceTimePolicy() throws Exception {
		URL policiesPath = getClass().getClassLoader().getResource("policies/policy_time.xml");
		URL reqPath = getClass().getClassLoader().getResource("req3.xml");
		
		AccessController controller = new AccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
		
		reqPath = getClass().getClassLoader().getResource("req3.1.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Deny", res);
	}

	public void testEvaluateServiceAdPolicy() throws Exception {
		URL policiesPath = getClass().getClassLoader().getResource("policies/policy_adblock.xml");
		URL reqPath = getClass().getClassLoader().getResource("req4.xml");
		
		AccessController controller = new AccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
		
		reqPath = getClass().getClassLoader().getResource("req4.1.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
		
		reqPath = getClass().getClassLoader().getResource("req4.2.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);
		
		reqPath = getClass().getClassLoader().getResource("req4.3.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Deny", res);		
	}
	
	public void testEvaluateCreditCardBlockPolicy() throws Exception {
		URL policiesPath = getClass().getClassLoader().getResource("policies/policy_cc.xml");
		URL reqPath = getClass().getClassLoader().getResource("req5.xml");
		
		AccessController controller = new AccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);

		reqPath = getClass().getClassLoader().getResource("req5.1.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Deny", res);
	}
	
	public void testEvaluateHTTPSPolicy() throws Exception {
		URL policiesPath = getClass().getClassLoader().getResource("policies/policy_noplaintext.xml");
		URL reqPath = getClass().getClassLoader().getResource("req6.xml");
		
		AccessController controller = new AccessController();
		String request = FileUtils.readFileToString(new File(reqPath.getFile()));
		String res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Permit", res);

		reqPath = getClass().getClassLoader().getResource("req6.1.xml");
		request = FileUtils.readFileToString(new File(reqPath.getFile()));
		res = controller.evaluate(policiesPath.getFile(), request);
		assertEquals("Deny", res);

	}
}
