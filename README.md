
[![GitHub tag](https://img.shields.io/github/tag/CtrHellenicStudies/Commentary.svg)](https://github.com/CtrHellenicStudies/Commentary/releases)
[![GitHub license](https://img.shields.io/badge/license-New%20BSD-blue.svg)](https://raw.githubusercontent.com/CtrHellenicStudies/Commentary/master/LICENSE)
[![GitLab build](http://gitlab.archimedes.digital/archimedes/ahcip/badges/master/build.svg)]()
[![GitLab coverage](http://gitlab.archimedes.digital/archimedes/ahcip/badges/master/coverage.svg)]()

# Center for Hellenic Studies Classical Commentaries


The Center for Hellenic Studies (CHS) Classical Commentaries application is part of an ongoing effort of the CHS to create communities around texts. The application is used for creating multi-tenant, textual commentaries for classical texts as well as for creating annotations on the Center for Hellenic Studies website. It also offers a public community of users similar to a social network.

The application supports three commentaries and two annotation platforms:

[A Homer Commentary in Progress](https://ahcip.chs.harvard.edu) - Commentary on the works of Homer


[A Pindar Commentary in Progress](https://pindar.chs.harvard.edu) - Commentary on Pindar's Odes

[A Pausanias Commentary in Progress]() - Commentary on the works of Pausanias (forthcoming)

[The Center for Hellenic Studies Publications](https://chs.harvard.edu) - Annotations on the CHS digital publications reading environment

[Classical Inquiries](https://classical-inquiries.chs.harvard.edu) - Annotations on the Classical Inquiries blog

[The Center for Hellenic Studies Community](https://profile.chs.harvard.edu) - CHS Community Platform

[Canonical Text Services URN Name Resolution Service](https://nrs.chs.harvard.edu) - Resolving persistent identifiers such as created in the CITE architecture

[GraphQL API to all commentaries and annotations with Linked Data support](https://api.chs.harvard.edu/graphiql) - All public data in the commentaries is surfaced through a GraphQL API endpoint with UI explorer

## Development

The CHS Commentaries is currently created with React, GraphQL, and Meteor. Due to the increasing complexity of the application, the trajectory of development will soon see less reliance on Meteor and corresponding packages and more on GraphQL, Redux, and Express.

### Getting started

To get started developing, you will need to clone the project and [install Meteor](https://www.meteor.com/install). Then, install node dependencies with `meteor npm i`. Next, edit your `hosts` file to add the `chs.local` subdomains:

```
127.0.0.1       chs.local
127.0.0.1       ahcip.chs.local
127.0.0.1       pindar.chs.local
127.0.0.1       pausanias.chs.local
127.0.0.1       profile.chs.local
127.0.0.1       api.chs.local
127.0.0.1       admin.chs.local
127.0.0.1       nrs.chs.local
127.0.0.1       classical-inquiries.chs.local
... etc
```

Finally, start the application with `meteor npm run start`. The application should start on port 5000, and create an initial tenant for you so that you may view the application running at http://ahcip.chs.local:5000.

### Branching methodology

The CHS Commentaries generally subscribes to the [git-flow](https://github.com/nvie/gitflow) branching model when practical. The project does not use release branches but tags releases.



## Deployment

NOTE: this section is still under active development and will change in subsequent iterations of the project.

Deployment is in progress with the GitLab CI on the [Archimedes GitLab instance](http://gitlab.archimedes.digital/archimedes/ahcip).

### Previous method of deployment

The current docker image build creates a stateless webapp image that will reference an external DB.

#### Building the image

From the project directory:
1) Build the app: `bin/build`
2) Build the docker image: `bin/build_image`

#### Testing the production image locally

To start the production image locally run `bin/start_prod_loc [MONGO_URL]`

This will create an app instance bound to port 3000 on the host and using MONGO_URL as the DB.



## Contact

For more information about the project or how to use the CHS Commentaries to start your own commentary and community, please contact [Leonard Muellner](mailto:muellner@chs.harvard.edu), Director of Publications and Information Technology at the CHS and Professor Emeritus of Classical Studies at Brandeis University.


## Credits

The CHS Commentaries is project undertaken by the [Center for Hellenic Studies](http://chs.harvard.edu) and is directed by Leonard Muellner and advised by Philip Desenne.
