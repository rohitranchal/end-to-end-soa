package edu.purdue.cs.soa.soap;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.apache.axis2.AxisFault;
import org.apache.axis2.context.MessageContext;
import org.apache.axis2.description.Parameter;
import org.apache.axis2.engine.Handler;
import org.apache.axis2.handlers.AbstractHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.methods.GetMethod;

public class SOAPHandler extends AbstractHandler implements Handler {

	private String name = "SOAPHandler";

	public String getName() {
		return this.name;
	}

	public Parameter getParameter(String arg0) {
		// TODO Auto-generated method stub
		return null;
	}

	public InvocationResponse invoke(MessageContext mc) throws AxisFault {

		String from = null;
		String to = null;

		try {
			//System.out.println(mc.getEnvelope());
			from = mc.getOptions().getProperty("from").toString();
			System.out.println("@@@@@@@@@@@@@@@From (soapHandler): " + mc.getOptions().getProperty("from"));
			
			to = mc.getOptions().getTo().toString();
			to = to.substring(to.indexOf("http"), to.indexOf("/axis2") );
			System.out.println("@@@@@@@@@@@@@@@To (soapHandler): " + to);

		} catch (Exception e) {
			//e.printStackTrace();
			System.out.println("no header!");
		}

		if ((from != null) && (to != null)){
			String url = "http://localhost:3000/interaction?from=" + from + "&to=" + to;
			////CallSMJava(url);
			callSM(url);
		}
		
		return InvocationResponse.CONTINUE;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void callSM(String url) {

		HttpClient client = new HttpClient();

		GetMethod get = new GetMethod(url);

		try {
			// execute the GET
			int status = client.executeMethod( get );

			// print the status and response
			System.out.println(status + "\n" + get.getResponseBodyAsString());

		} catch (HttpException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			// release any connection resources used by the method
			get.releaseConnection();
		}
	}

	public String CallSMJava(String inputURL) {
		URL url;
		HttpURLConnection conn;
		BufferedReader rd;
		String line;
		String result = "";
		try {
			url = new URL(inputURL);
			conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			while ((line = rd.readLine()) != null) {
				result += line;
			}
			rd.close();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
}
