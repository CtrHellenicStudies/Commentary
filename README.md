# CHS Classical Commentaries

The CHS Classical Commentaries application is used for creating multitenant, textual commentaries for classical texts.  

### Building and Deploying
The current docker image build creates a stateless webapp image that will reference an external DB.

#### Building the image
From the project directory:
1) Build the app: `bin/build`
2) Build the docker image: `bin/build_image`

#### Testing the production image locally
To start the procution image locally run `bin/start_prod_loc [MONGO_URL]`

This will create an app instance bound to port 3000 on the host and using MONGO_URL as the DB.
