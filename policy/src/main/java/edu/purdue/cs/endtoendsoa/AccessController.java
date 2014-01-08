package edu.purdue.cs.endtoendsoa;

import java.io.ByteArrayInputStream;

import javax.xml.namespace.QName;

import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.OMXMLBuilderFactory;
import org.wso2.balana.Balana;
import org.wso2.balana.PDP;
import org.wso2.balana.finder.impl.FileBasedPolicyFinderModule;

public class AccessController {

	private String policyDir;
	private Balana balana;

	public AccessController(String policyDir) {
		this.policyDir = policyDir;
		System.setProperty(FileBasedPolicyFinderModule.POLICY_DIR_PROPERTY,
				this.policyDir);
		this.balana = Balana.getInstance();
	}

	public String evaluate(String request) {
		PDP pdp = new PDP(balana.getPdpConfig());
		String res = pdp.evaluate(request);
		ByteArrayInputStream in = new ByteArrayInputStream(res.getBytes());
		OMElement elem = OMXMLBuilderFactory.createOMBuilder(in).getDocumentElement();
		
		OMElement tmp = elem.getFirstChildWithName(new QName("urn:oasis:names:tc:xacml:3.0:core:schema:wd-17", "Result"));
		tmp = tmp.getFirstChildWithName(new QName("urn:oasis:names:tc:xacml:3.0:core:schema:wd-17", "Decision"));
		return tmp.getText();
	}
}
