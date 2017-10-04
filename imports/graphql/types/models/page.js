import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInputObjectType
} from 'graphql';

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
