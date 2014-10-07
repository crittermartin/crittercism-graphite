Crittercism-Graphite Connector
=====================

A sample Crittercism API connector that pushes Crittercism data to Graphite.

##Components:

* CrittercismClient.js - a Crittercism REST API Data Transfer Object for node.js
* cc.js - the Crittercism Connector node app
* ccconfig.js - App configuration

## Requirements:

* A Crittercism account with a REST API access token - http://crittercism.com
* Graphite installed and working with carbon-cache - http://graphite.readthedocs.org
* Node.js and npm - http://nodejs.org

##Instructions:

1. Install Graphite and make sure it works!

2. Edit Graphite's conf/storage_schemas.conf and conf/storage_aggregation.conf, and add retention settings like the ones you see in this project's graphite-conf/ folder.

3. Start or restart the Carbon cache and Graphite web servers.

4. Get the package dependencies for this app by typing "npm install"

5. Edit ccconfig.js in this directory and fill in your Crittercism and Graphite details.

6. Run the app by typing "node cc"

7. Go to the Graphite browser (usually on port 8080) and make sure data is being populated under app.*

8. Install your favorite Graphite front-end to make nice-looking dashboards.  I recommend Grafana (http://grafana.org) as it is very lightweight and needs almost no configuration. Some sample scripted Grafana dashboards are included here in the grafana-example-dashboards/ folder.
