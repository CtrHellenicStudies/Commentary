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

const BookInputType = new GraphQLInputObjectType({
	name: 'BookInputType',
	description: 'A book input type',
	fields: {
		title: {
			type: GraphQLString
		},
		slug: {
			type: GraphQLString
		},
		author: {
			type: GraphQLString
		},
		chapters: {
			type: new GraphQLList(GraphQLJSON)
		},
		coverImage: {
			type: GraphQLString
		},
		year: {
			type: GraphQLInt
		},
		publisher: {
			type: GraphQLString
		},
		citation: {
			type: GraphQLString
		},
		tenantId: {
			type: GraphQLString
		}
	}
});

const BookType = new GraphQLObjectType({
	name: 'BookType',
	description: 'A single book',
	fields: {
		_id: {
			type: GraphQLString
		},
		title: {
			type: GraphQLString
		},
		slug: {
			type: GraphQLString
		},
		author: {
			type: GraphQLString
		},
		chapters: {
			type: new GraphQLList(GraphQLJSON)
		},
		coverImage: {
			type: GraphQLString
		},
		year: {
			type: GraphQLInt
		},
		publisher: {
			type: GraphQLString
		},
		citation: {
			type: GraphQLString
		},
		tenantId: {
			type: GraphQLString
		}
	}
});

export { BookInputType, BookType }