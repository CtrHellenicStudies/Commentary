= A Homer Commentary in Progress

This is the Meteor application for A Homer Commentary in Progress 


### Building
In the application directory, to build for deployment, run the following command:
```
meteor build .
```
(or if you like storing your build files in named directories, something like "meteor build ../builds/1.0.1/")

### Deploying
The server hosting this application will need Node 4.5.0 (usage of nvm recommended), MongoDB, and NGINX.

First, rsync the generated tar.gz file to the server. Extract the build archive in a directory of your choice (ideally one that makes sense with the build version--1.0.1, 1.1.0, etc.).

Ensure you are using the correct version of Node for your build and cd to ./bundle/programs/server of your extracted application and run
```
npm install
```

Configure a Upstart service file as described in the tutorial linked at the start of this section. Ensure all parameters included in the file are set appropriately.

Configure and enable an NGINX virtual host to proxy requests to the port the application is listening on.

Start the Upstart service with whatever you named your service file.  Something such as this:
```
sudo start ahcip
```
If you named your Upstart service file ahcip.conf; otherwise, start whatever you named your Upstart service file.

### Docker Deploy (In Development)
The current docker image build creates a stateless webapp image that will reference an external DB.

#### Building the image
From the project directory:
1) Build the app: `bin/build`
2) Build the docker image: `bin/build_image`

#### Testing the production image locally
To start the procution image locally run `bin/start_prod_loc [MONGO_URL]`

This will create an app instance bound to port 3000 on the host and using MONGO_URL as the DB.
 
