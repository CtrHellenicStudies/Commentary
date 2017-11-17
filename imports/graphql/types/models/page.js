import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInputObjectType
} from 'graphql';

/**
 * Page model type
 * @type {GraphQLObjectType}
 */
const PageType = new GraphQLObjectType({
	name: 'PageType',
	description: 'A single page database entry',
	fields: {
		_id: {
			type: GraphQLString
		},
		title: {
			type: GraphQLString,
		},
		subtitle: {
			type: GraphQLString,
		},
		headerImage: {
			type: new GraphQLList(GraphQLString),
		},
		slug: {
			type: GraphQLString,
		},
		byline: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		content: {
			type: GraphQLString,
		},
	},
});

/**
 * Page input type
 * @type {GraphQLInputObjectType}
 */
const PageInputType = new GraphQLInputObjectType({
	name: 'PageInputType',
	description: 'A single page database entry',
	fields: {
		title: {
			type: GraphQLString,
		},
		subtitle: {
			type: GraphQLString,
		},
		headerImage: {
			type: new GraphQLList(GraphQLString),
		},
		slug: {
			type: GraphQLString,
		},
		byline: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		content: {
			type: GraphQLString,
		},
	},
});

export {PageType, PageInputType};
