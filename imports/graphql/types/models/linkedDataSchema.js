import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInputObjectType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

const LinkedDataSchemaType = new GraphQLObjectType({
	name: 'LinkedDataSchemaType',
	description: 'Linked data schema',
	fields: {
		_id: {
			type: GraphQLString,
		},
		collectionName: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		terms: {
			type: new GraphQLList(GraphQLJSON),
		},
	},
});

const LinkedDataSchemaInputType = new GraphQLInputObjectType({
	name: 'LinkedDataSchemaInputType',
	description: 'Linked data schema',
	fields: {
		collectionName: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		terms: {
			type: new GraphQLList(GraphQLJSON),
		},
	},
});

export {LinkedDataSchemaType, LinkedDataSchemaInputType};
