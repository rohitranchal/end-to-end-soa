package edu.purdue.cs.soa.service;

import java.util.HashMap;
import java.util.Map;

import org.apache.axis2.client.Options;
import org.apache.axis2.context.MessageContext;
import javax.xml.soap.SOAPEnvelope;

public class Service
{

	public String operation(String input) {
		
		return "-> " + input;
	}

}
