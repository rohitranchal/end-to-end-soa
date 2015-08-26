# XACML Based Monitoring #

There are two steps in developing a new active trust management module which uses a XACML policy.
  * Draft XACML policy and request
  * Integrate the tested policy with monitor

## Draft XACML Policy and Request ##

- Create a new xml policy file as policy/src/test/resources/policies/policy\_policyname.xml
- Create new xml request files as policy/src/test/resources/req#.xml
- Write test cases to test the new policy/request in
> policy/src/test/java/edu/purdue/cs/endtoendsoa/TestAccessController.java
- Run edu.purdue.cs.endtoendsoa.TestAccessController as Junit test to test the policies/requests
- After successful testing, deploy policy on service monitor as explained in next section

## Integration with Service Monitor ##

- Copy the new policy file (policy\_policyname.xml) into node/monitor/trust\_algo/active/policies/
- To generate the request template for this policy, go to node/tools/xml2json and run
> node xml2json.js ../../../policy/src/test/resources/req#.xml > req\_policyname.json
> req#.xml is one of the request files for the above policy
- Move the new json request file into node/monitor/trust\_algo/active/request\_templates/
> mv req\_policyname.json ../../monitor/trust\_algo/active/request\_templates/
- Edit the req\_policyname.json file and make all the attribute values as empty strings except "READ"
> check other req\_policyxyz.json files to get an idea
- Create a new file as xacml#.js under node/monitor/trust\_algo/active/
- Copy all content from another xacml file such as xacml2.js into the new file
- In the auth function, under section "Update obj with incoming parameters"
> update code to add appropriate content (attribute values) to the request file as per the policy
- To avoid setting the default trust algo in GUI every time, you can update
> node/monitor/trust\_algo/index.js file to set the default trust algo to the new policy
> var default\_active\_trust\_algo = #; (# comes from xacml#.js)
- Try one of the active scenario in service monitor management console to test the new policy



---


node.js + XACML : http://blog.ruchith.org/2014/01/nodejs-xacml.html