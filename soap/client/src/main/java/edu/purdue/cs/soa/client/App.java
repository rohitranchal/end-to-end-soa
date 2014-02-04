package edu.purdue.cs.soa.client;

import java.util.Iterator;

import javax.xml.namespace.QName;

import org.apache.axiom.om.OMAbstractFactory;
import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.OMFactory;
import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.client.ServiceClient;

public class App {

	/*
	 * 
	 */
	public static void main(String[] args) throws Exception {
		
		OMFactory omFactory = OMAbstractFactory.getOMFactory();
		OMElement req = omFactory.createOMElement(new QName("http://service.soa.cs.purdue.edu", "operation"));
		OMElement inputElem = omFactory.createOMElement(new QName("http://service.soa.cs.purdue.edu", "input"));
		inputElem.setText("S1");
		req.addChild(inputElem);
		
		EndpointReference epr = new EndpointReference("http://localhost:8081/axis2/services/service");
		
		Options options = new Options();
		options.setTo(epr);
		//Create request
		ServiceClient client = new ServiceClient();
		
		//System.out.println(req);
		client.setTargetEPR(epr);
		OMElement resp = client.sendReceive(req);
		
		Iterator respIt = resp.getChildrenWithName(new QName(
				"http://service.soa.cs.purdue.edu", "return", "ns"));
		OMElement respHeader = null;
		if(respIt.hasNext()) {
			try {
				respHeader = (OMElement)respIt.next();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		System.out.println("#################Resp from Service1");
		System.out.println(respHeader.getText());

	}

}
