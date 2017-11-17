import {
	GraphQLObjectType,
	GraphQLInputObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

/**
 * Commenter model type
 * @type {GraphQLObjectType}
 */
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

/**
 * Commenter input type
 * @type {GraphQLInputObjectType}
 */
const CommenterInputType = new GraphQLInputObjectType({
	name: 'CommenterInputType',
	description: 'A commenter in the commentary',
	fields: {
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

export { CommenterType, CommenterInputType };
