import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
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
		terms: {
			type: new GraphQLList(GraphQLJSON),
		},
	},
});

export {LinkedDataSchemaType};
