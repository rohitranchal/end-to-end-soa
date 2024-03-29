package edu.purdue.cs.soa.service;

import java.rmi.RemoteException;
import java.util.Iterator;

import javax.xml.namespace.QName;

import org.apache.axiom.om.OMAbstractFactory;
import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.OMFactory;
import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.ServiceClient;
import org.apache.axis2.context.MessageContext;

public class Service
{

	public String operation(String input) throws RemoteException {
		
		MessageContext mc = MessageContext.getCurrentMessageContext(); 
		System.out.println(mc.getEnvelope());
		
		OMFactory omFactory = OMAbstractFactory.getOMFactory();
		OMElement req = omFactory.createOMElement(new QName("http://service.soa.cs.purdue.edu", "operation"));
		OMElement inputElem = omFactory.createOMElement(new QName("http://service.soa.cs.purdue.edu", "input"));
		inputElem.setText("S3");
		req.addChild(inputElem);
		
		EndpointReference epr = new EndpointReference("http://localhost:8083/axis2/services/service");
		
		//Create request
		ServiceClient client = new ServiceClient();
		client.setTargetEPR(epr);
		//client.setOptions(options);
		
		client.getOptions().setProperty("from", "http://localhost:8082");
		
		System.out.println(req);

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
		
//		System.out.println("#################Resp from Service3");
//		System.out.println(resp);		
		return " ->" + input + respHeader.getText();
		
	}
	
}