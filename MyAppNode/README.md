# CIS550 Project

## Website
The website with current code is hosted at: http://ec2-52-43-53-209.us-west-2.compute.amazonaws.com
The service will remain up for the forseeable future.


## Setup
Setup of this application is very specific. Some notes:
    - Node Modules for the initial codebase were taken directly from CIS 550 HW2. 'npm install' did not 
      fetch the correct versions for those dependencies otherwise.
    - Node Modules for async, d3, datamaps, mongojs, and topojson are listed in package.json and can
      be correctly installed with 'npm install'.
    - IMPORTANT: The oracledb Node Module has a large number of non-node dependencies and must be
      compiled from C. It also requires access to Oracle client libraries. More info can be found
      here: https://github.com/oracle/node-oracledb#installation



### Tools

Created with [Nodeclipse v0.5](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   
