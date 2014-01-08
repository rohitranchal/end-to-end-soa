package edu.purdue.cs.endtoendsoa;

import java.io.File;
import java.net.URL;

import junit.framework.TestCase;

import org.apache.commons.io.FileUtils;

public class TestAccessController extends TestCase {

	public void testEvaluate() throws Exception {

		URL policiesPath = getClass().getClassLoader().getResource("policies/");
		URL req1Path = getClass().getClassLoader().getResource("req1.xml");
		
		AccessController controller = new AccessController(policiesPath.getFile());
		String request = FileUtils.readFileToString(new File(req1Path.getFile()));
		String res = controller.evaluate(request);
		assertEquals("Permit", res);

	}

}
