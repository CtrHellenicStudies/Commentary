import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList,
	GraphQLInputObjectType
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';

const Subwork = new GraphQLObjectType({
	name: 'Subwork',
	description: 'Subwork - part of a single work type',
	fields: {
		title: {
			type: GraphQLString,
		},
		slug: {
			type: GraphQLString,
		},
		n: {
			type: GraphQLInt,
		},
		tlgNumber: {
			type: GraphQLString,
		},
		nComments: {
			type: GraphQLInt,
		},
		commentHeatmap: {
			type: new GraphQLList(GraphQLJSON),
		},
	},
});

const SubworkInput = new GraphQLInputObjectType({
	name: 'SubworkInput',
	description: 'Subwork - part of a single work type',
	fields: {
		title: {
			type: GraphQLString,
		},
		slug: {
			type: GraphQLString,
		},
		n: {
			type: GraphQLInt,
		},
		tlgNumber: {
			type: GraphQLString,
		},
		nComments: {
			type: GraphQLInt,
		},
		commentHeatmap: {
			type: new GraphQLList(GraphQLJSON),
		},
	},
});

console.log("Subwork LOG", Subwork);
export { Subwork, SubworkInput };
