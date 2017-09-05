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
import {Subwork, SubworkInput} from './subworks';

console.log("Subwork LOG", Subwork);

const WorkType = new GraphQLObjectType({
	name: 'WorkType',
	description: 'A primary work in the commentary that the comments are created about',
	fields: {
		_id: {
			type: GraphQLString,
		},
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
			type: new GraphQLList(Subwork),
		},
	},
});
const WorkInputType = new GraphQLInputObjectType({
	name: 'WorkInputType',
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
			type: new GraphQLList(SubworkInput),
		},
	}
});
export { WorkType, WorkInputType };
