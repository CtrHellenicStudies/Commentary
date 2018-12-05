
[![GitHub tag](https://img.shields.io/github/tag/CtrHellenicStudies/Commentary.svg)](https://github.com/CtrHellenicStudies/Commentary/releases)
[![GitHub license](https://img.shields.io/badge/license-New%20BSD-blue.svg)](https://raw.githubusercontent.com/CtrHellenicStudies/Commentary/master/LICENSE)
[![GitLab build](http://gitlab.archimedes.digital/archimedes/ahcip/badges/master/build.svg)]()
[![GitLab coverage](http://gitlab.archimedes.digital/archimedes/ahcip/badges/master/coverage.svg)]()

# Center for Hellenic Studies Classical Commentaries


The Center for Hellenic Studies (CHS) Classical Commentaries application is part of an ongoing effort of the CHS to create communities around texts. The application is used for creating multi-tenant, textual commentaries for classical texts as well as for creating annotations on the Center for Hellenic Studies website. It also offers a public community of users with some functionality similar to a social network.

The application supports three commentaries and two annotation platforms:

[A Homer Commentary in Progress](https://ahcip.chs.harvard.edu) - Commentary on the works of Homer

[A Pindar Commentary in Progress](https://pindar.chs.harvard.edu) - Commentary on Pindar's Odes

[A Pausanias Commentary in Progress]() - Commentary on the works of Pausanias (forthcoming)

[The Center for Hellenic Studies Publications](https://chs.harvard.edu) - Annotations on the CHS digital publications reading environment

[Classical Inquiries](https://classical-inquiries.chs.harvard.edu) - Annotations on the Classical Inquiries blog

[The Center for Hellenic Studies Community](https://profile.chs.harvard.edu) - CHS Community Platform

[Canonical Text Services URN Name Resolution Service](https://nrs.chs.harvard.edu) - Resolving persistent identifiers such as created in the [CITE architecture](https://github.com/cite-architecture/)

[GraphQL API to all commentaries and annotations with Linked Data support](https://api.chs.harvard.edu/graphiql) - All public data in the commentaries is surfaced through a GraphQL API endpoint with UI explorer

## Development

The CHS Commentaries application frontend is created with the [Create React App](https://github.com/facebookincubator/create-react-app) and has intentionally not deviated (e.g. ejecting webpack) for easy reuse by the community in the future. The backend for the application is a GraphQL API server built with express that you can find here: https://github.com/CtrHellenicStudies/CommentaryAPI

The Commentary GraphQL API relies on stitching the commentary GraphQL schema with The Center for Hellenic Studies Text Server with [Canonical Text Service](http://cite-architecture.github.io/cts/) underpinnnings here: https://github.com/CtrHellenicStudies/Textserver


### Getting started

To get started developing, you will need to clone the project and [install Yarn](https://yarnpkg.com/lang/en/docs/install/). Then, install node dependencies with `yarn`. Next, edit your `hosts` file to add the `chs.local` subdomains:

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

Finally, start the application with `yarn start`. The application should start on port 3000, and create an initial tenant for you so that you may view the application running at http://ahcip.chs.local:3000.

### Branching methodology

The CHS Commentaries generally subscribes to the [git-flow](https://github.com/nvie/gitflow) branching model when practical. The project does not use release branches but tags releases.



## Deployment

Deployment is currently managed internally with the GitLab CI on the [Archimedes GitLab instance](http://gitlab.archimedes.digital/archimedes/ahcip), but you can follow one of several steps from the [Create React App Documentation for Deployment](https://github.com/facebookincubator/create-react-app).

**We will update this section soon with more information about how to deploy your own commentary to as simple of hosting environment as GitHub pages. For now the Create React App documentation has this information.**

Deployment of the CHS Commentaries platform frontend does not require advanced technical knowledge.


## Contact

For more information about the project or how to use the CHS Commentaries to start your own commentary and community, please contact [Leonard Muellner](mailto:muellner@chs.harvard.edu), Director of Publications and Information Technology at the CHS and Professor Emeritus of Classical Studies at Brandeis University.


## Credits

The CHS Commentaries is project undertaken by the [Center for Hellenic Studies](http://chs.harvard.edu) and is directed by Leonard Muellner and advised by Philip Desenne.
