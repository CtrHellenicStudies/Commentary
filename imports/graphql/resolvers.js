import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import slugify from 'slugify';
import Commenters from '/imports/models/commenters';
import Comments from '/imports/models/comments';
import DiscussionComments from '/imports/models/discussionComments';
import Keywords from '/imports/models/keywords';
import LinkedDataSchemas from '/imports/models/linkedDataSchemas';
import ReferenceWorks from '/imports/models/referenceWorks';
import TextNodes from '/imports/models/textNodes';
import Works from '/imports/models/works';

// create the resolve functions for the available GraphQL queries
const resolvers = {
	Query: {
		works(_, args) {
			if ('title' in args) {
				args.title = { $regex: args.title, $options: 'i'};
			}
			if ('slug' in args) {
				args.slug = { $regex: args.slug, $options: 'i'};
			}
			return Works.find(args).fetch();
		},
	},

};

export default resolvers;
