import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';


const TranslationType = new GraphQLObjectType({
	name: 'TranslationType',
	description: 'A translation of a textnode in the commentary',
	fields: {
		tenantId: {
			type: GraphQLString,
		},
		created: {
			type: GraphQLDate,
		},
		updated: {
			type: GraphQLDate,
		},
		author: {
			type: GraphQLString,
		},
		work: {
			type: GraphQLString,
		},
		subwork: {
			type: GraphQLInt,
		},
		lineFrom: {
			type: GraphQLInt,
		},
		lineTo: {
			type: GraphQLInt,
		},
		nLines: {
			type: GraphQLInt,
		},
		revisions: {
			type: new GraphQLList(GraphQLJSON),
		},
	},
});

export {TranslationType};
