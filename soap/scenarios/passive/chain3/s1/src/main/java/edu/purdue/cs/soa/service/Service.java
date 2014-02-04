package edu.purdue.cs.soa.service;

import java.rmi.RemoteException;
import java.util.Iterator;

import javax.xml.namespace.QName;

import org.apache.axiom.om.OMAbstractFactory;
import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.OMFactory;
import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.client.ServiceClient;

public class Service
{

	public String operation(String input) throws RemoteException {
		
		OMFactory omFactory = OMAbstractFactory.getOMFactory();
		OMElement req = omFactory.createOMElement(new QName("http://service.soa.cs.purdue.edu", "operation"));
		OMElement inputElem = omFactory.createOMElement(new QName("http://service.soa.cs.purdue.edu", "input"));
		inputElem.setText("S2");
		req.addChild(inputElem);
		
		EndpointReference epr = new EndpointReference("http://localhost:8082/axis2/services/service");
		
		Options options = new Options();
		options.setTo(epr);
		//options.setAction("urn:operation");
		//Create request
		ServiceClient client = new ServiceClient();
		//client.engageModule("");
		client.getOptions().setProperty("from", "http://localhost:8081");
		
		//System.out.println(client.get);
		
		client.setTargetEPR(epr);
		OMElement resp = client.sendReceive(req);
		
		Iterator respIt = resp.getChildrenWithName(new QName(
				"http://service.soa.cs.purdue.edu", "return", "ns"));
		OMElement respHeader = null;
		if(respIt.hasNext()) {
			try {
				respHeader = (OMElement)respIt.next();
//				System.out.println("^^^^^^^^^^^^^^^^^^" + respHeader.getText());
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
//		System.out.println("#################Resp from Service2");
//		System.out.println(resp);		

		return input + respHeader.getText();
	}
	
}
