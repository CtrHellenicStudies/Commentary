import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';


const WorkType = new GraphQLObjectType({
	name: 'WorkType',
	description: 'A primary work in the commentary that the comments are created about',
	fields: {
		title: {
			type: GraphQLString,
		},
		tenantId: {
			type: GraphQLString,
		},
		tlgCreator: {
			type: GraphQLString,
		},
		tlg: {
			type: GraphQLString,
		},
		slug: {
			type: GraphQLString,
		},
		order: {
			type: GraphQLInt,
		},
		nComments: {
			type: GraphQLInt,
		},
		subworks: {
			type: new GraphQLList(GraphQLJSON),
		},
	},
});


export default WorkType;
