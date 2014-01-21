
import java.awt.BorderLayout;
import java.awt.Checkbox;
import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JProgressBar;
import javax.swing.JScrollPane;
import javax.swing.SpringLayout;
 
public class ServiceTrust {
	
	private static String scenarioLabels[]={"Sevice 2 accepts the given task", 
												"Service 2 rejects the given task",
												"Service 2 is currently handling few service requests",
												"Service 2 is currently handling mediocre amount of service requests",
												"Service 2 is handling a large amount of service requests",
												"Service 2 claims it was subjected to a malicious attack",
												"Service 2 is currently not available",	
												"Service 2 completes the given task as expected",
												"Service 2 completes the given task, but not as expected",
												"Service 2 completes the task in optimal time w.r.t location",
												"Service 2 completes the task in a mediocre time w.r.t location",
												"Service 2 completes the task in a very large amount of time w.r.t location",
												"Service fails to complete the given task"
										
									};
	private static ArrayList<Checkbox> scenarioBoxs = new ArrayList<Checkbox>();
	private static JButton submit = new JButton("Submit");
	private static JProgressBar trustBar;
	private static int increase;
	private static int maliciousClaims=0;
	
    /**
     * Create the GUI and show it.  For thread safety,
     * this method should be invoked from the
     * event-dispatching thread.
     */
    private static void createAndShowGUI() {
    	  
    	 try {
             for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                 if ("Nimbus".equals(info.getName())) {
                     javax.swing.UIManager.setLookAndFeel(info.getClassName());
                     break;
                 }
             }
         } catch (ClassNotFoundException ex) {
             java.util.logging.Logger.getLogger(ServiceTrust.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
         } catch (InstantiationException ex) {
             java.util.logging.Logger.getLogger(ServiceTrust.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
         } catch (IllegalAccessException ex) {
             java.util.logging.Logger.getLogger(ServiceTrust.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
         } catch (javax.swing.UnsupportedLookAndFeelException ex) {
             java.util.logging.Logger.getLogger(ServiceTrust.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
         }

        
        //Create and populate the panel.
        JPanel p = new JPanel(new SpringLayout());
        for (int i = 0; i < scenarioLabels.length; i++) {
        	scenarioBoxs.add(new Checkbox(scenarioLabels[i]));
            p.add(scenarioBoxs.get(i));
        }
 
        //Lay out the panel.
        SpringUtilities.makeCompactGrid(p,
                                        scenarioLabels.length, 1, //rows, cols
                                        6, 6,        //initX, initY
                                        6, 6);       //xPad, yPad
 
        //Create and set up the window.
        JFrame frame = new JFrame("Service Trust Model");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
 
        trustBar = new JProgressBar();
        trustBar.setPreferredSize(new Dimension(700,60));
        trustBar.setStringPainted(true);
	    trustBar.setValue(0);
	    frame.getContentPane().add(trustBar, BorderLayout.NORTH);
        
        
        //Set up the content pane.
	    p.setOpaque(true);  
        JScrollPane scroller = new JScrollPane(p);
        frame.getContentPane().add(scroller, BorderLayout.CENTER);
        
        
        //Add action listener to button
        
        
        submit.addActionListener(new ActionListener() {
        	 
            public void actionPerformed(ActionEvent e)
            {
            	submit.setEnabled(false);
            	increase=0;
            	if(scenarioBoxs.get(0).getState()){ // Accepted Task
            		if(scenarioBoxs.get(12).getState()){//Fails to complete Task
            			//Reduce Trust	
            			if(scenarioBoxs.get(2).getState()){ //Handling few service requests
            				setIncrease(-10, -6, -4, -3);
            			}
            			else if(scenarioBoxs.get(3).getState()){ //Handling Mediocre Service requests
            				setIncrease(-6, -4, -3, -2);
            			}
            			else if(scenarioBoxs.get(4).getState()){ //Handling Large number of Service requests
            				setIncrease(-2, -2, -1, -1);
            			}
            			else{
            				setIncrease(-6, -4, -3, -2);
            			}
            		
            		}
            		else if(scenarioBoxs.get(7).getState()){ //Completes Task as Expected
            			if(scenarioBoxs.get(2).getState()){ //Handling few service requests
            				if(scenarioBoxs.get(9).getState()){ //Completed Task in Optimal Time
            					setIncrease(1,2,4,6);
            				}
            				else if(scenarioBoxs.get(10).getState()){ //Completed Task in Mediocre Time
            					setIncrease(1,1,3,4);
            				}
            				else if(scenarioBoxs.get(11).getState()){ //Took very long time to Complete Task
            					setIncrease(-2,-1,0,1);
            				}
            			}
            			else if(scenarioBoxs.get(3).getState()){//Handling Mediocre Service requests
        					
            				if(scenarioBoxs.get(9).getState()){ //Completed Task in Optimal Time
            					setIncrease(1,2,5,7);
            				}
            				else if(scenarioBoxs.get(10).getState()){ //Completed Task in Mediocre Time
            					setIncrease(1,2,4,6);
            				}
            				else if(scenarioBoxs.get(11).getState()){ //Took very long time to Complete Task
            					setIncrease(0,0,2,4);
            				}
            			}
            			else if(scenarioBoxs.get(4).getState()){//Handling Large Service Requests
            				if(scenarioBoxs.get(9).getState()){ //Completed Task in Optimal Time
            					setIncrease(2,4,6,8);
            				}
            				else if(scenarioBoxs.get(10).getState()){ //Completed Task in Mediocre Time
            					setIncrease(1,3,5,7);
            				}
            				else if(scenarioBoxs.get(11).getState()){ //Took very long time to Complete Task
            					setIncrease(0,1,3,5);
            				}
            			}
            		}
            		else if(scenarioBoxs.get(8).getState()){ //Completes Task, but not as expected
            			setIncrease(-8,-6,-4,-2);
            		}
            		
            	}
            	else if(scenarioBoxs.get(1).getState()){ // Rejected Task
            		if(scenarioBoxs.get(5).getState()){//Subjected To Malicious Attack
            			//Don't reduce trust
            			increase-=(maliciousClaims++/3);
            		}
            		else if(scenarioBoxs.get(2).getState()){ //Handling few service requests
        				setIncrease(-10, -6, -4, -3);
        			}
        			else if(scenarioBoxs.get(3).getState()){ //Handling Mediocre Service requests
        				setIncrease(-6, -4, -3, -2);
        			}
        			else if(scenarioBoxs.get(4).getState()){ //Handling Large number of Service requests
        				setIncrease(-2, -2, -1, -1);
        			}
        			else{
        				setIncrease(-6, -4, -3, -2);
        			}
            	}
                //Execute when button is pressed
                trustBar.setValue(trustBar.getValue()+increase);
                submit.setEnabled(true);
            }
        });
        
        
        
        frame.getContentPane().add(submit, BorderLayout.SOUTH);
        
        frame.setPreferredSize(new Dimension(600,600));
        //Display the window.
        frame.pack();
        frame.setVisible(true);
    }
    
    private static void setIncrease( int a, int b, int c, int d){
    	
    	if(trustBar.getValue() >= 75){
			increase+=a;
		}
		else if(trustBar.getValue() >=50){
			increase+=b;
		}
		else if(trustBar.getValue()>=30){
			increase+=c;
		}
		else{
			increase+=d;
		}
    }
 
    public static void main(String[] args) {
        //Schedule a job for the event-dispatching thread:
        //creating and showing this application's GUI.
        javax.swing.SwingUtilities.invokeLater(new Runnable() {
            public void run() {
                createAndShowGUI();
            }
        });
    }
}