import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInputObjectType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

/**
 * Linked data schema model type
 * @type {GraphQLObjectType}
 */
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

/**
 * Linked data schema input type
 * @type {GraphQLInputObjectType}
 */
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
