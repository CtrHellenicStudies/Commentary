import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInputObjectType,
	GraphQLList
} from 'graphql';
import GraphQLDate from 'graphql-date';


const ReferenceWorkType = new GraphQLObjectType({
	name: 'ReferenceWorkType',
	description: 'A work referenced in the commentary as a secondary source',
	fields: {
		_id: {
			type: GraphQLString,
		},
		title: {
			type: GraphQLString,
		},
		slug: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		link: {
			type: GraphQLString,
		},
		authors: {
			type: new GraphQLList(GraphQLString),
		},
		coverImage: {
			type: GraphQLString,
		},
		date: {
			type: GraphQLDate,
		},
		urnCode: {
			type: GraphQLString,
		},
		description: {
			type: GraphQLString,
		},
		citation: {
			type: GraphQLString,
		},
	},
});

const ReferenceWorkInputType = new GraphQLInputObjectType({
	name: 'ReferenceWorkInputType',
	description: 'A work referenced in the commentary as a secondary source',
	fields: {
		title: {
			type: GraphQLString,
		},
		slug: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		link: {
			type: GraphQLString,
		},
		authors: {
			type: new GraphQLList(GraphQLString),
		},
		coverImage: {
			type: GraphQLString,
		},
		date: {
			type: GraphQLDate,
		},
		urnCode: {
			type: GraphQLString,
		},
		description: {
			type: GraphQLString,
		},
		citation: {
			type: GraphQLString,
		},
	},
});

export {ReferenceWorkType, ReferenceWorkInputType};
