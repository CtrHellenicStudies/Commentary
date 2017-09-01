import {
	GraphQLString,
	GraphQLInputObjectType
} from 'graphql';
import GraphQLDate from 'graphql-date';

const RevisionInputType = new GraphQLInputObjectType({
	name: 'RevisionInput',
	description: 'A revision',
	fields: {
		text: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		created: {
			type: GraphQLDate,
		},
		updated: {
			type: GraphQLDate,
		},
	},
});

export {RevisionInputType}