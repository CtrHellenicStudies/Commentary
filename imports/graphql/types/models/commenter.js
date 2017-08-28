import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

// models
import Commenters from '/imports/models/commenters';
import Comments from '/imports/models/comments';

// types
import CommentType from '/imports/graphql/types/models/comment';

const CommenterType = new GraphQLObjectType({
	name: 'CommenterType',
	description: 'A commenter in the commentary',
	fields: {
		_id: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		name: {
			type: GraphQLString,
		},
		slug: {
			type: GraphQLString,
		},
		avatar: {
			type: GraphQLJSON,
		},
		bio: {
			type: GraphQLString,
		},
		isAuthor: {
			type: GraphQLBoolean,
		},
		tagline: {
			type: GraphQLString,
		},
		featureOnHomepage: {
			type: GraphQLBoolean,
		},
		nCommentsTotal: {
			type: GraphQLInt,
		},
		nCommentsWorks: {
			type: new GraphQLList(GraphQLJSON),
		},
		nCommentsIliad: {
			type: GraphQLInt,
		},
		nCommentsOdyssey: {
			type: GraphQLInt,
		},
		nCommentsHymns: {
			type: GraphQLInt,
		},
		nCommentsKeywords: {
			type: new GraphQLList(GraphQLJSON),
		},
	},
});


export default CommenterType;
