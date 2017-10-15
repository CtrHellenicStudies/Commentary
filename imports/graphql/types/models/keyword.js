import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLInputObjectType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

/**
 * Keyword type
 * @type {GraphQLObjectType}
 */
const KeywordType = new GraphQLObjectType({
	name: 'KeywordType',
	description: 'A tag of a word or idea in the commentary',
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
		description: {
			type: GraphQLString,
		},
		descriptionRaw: {
			type: GraphQLString,
		},
		type: {
			type: GraphQLString,
		},
		count: {
			type: GraphQLInt,
		},
		work: {
			type: GraphQLJSON,
		},
		subwork: {
			type: GraphQLJSON,
		},
		lineFrom: {
			type: GraphQLInt,
		},
		lineTo: {
			type: GraphQLInt,
		},
		lineLetter: {
			type: GraphQLString,
		},
		nLines: {
			type: GraphQLInt,
		},
		tenantId: {
			type: GraphQLString,
		},
	},
});

/**
 * Keyword input type
 * @type {GraphQLInputObjectType}
 */
const KeywordInputType = new GraphQLInputObjectType({
	name: 'KeywordInputType',
	description: 'A tag of a word or idea in the commentary',
	fields: {
		title: {
			type: GraphQLString,
		},
		slug: {
			type: GraphQLString,
		},
		description: {
			type: GraphQLString,
		},
		descriptionRaw: {
			type: GraphQLString,
		},
		type: {
			type: GraphQLString,
		},
		count: {
			type: GraphQLInt,
		},
		work: {
			type: GraphQLJSON,
		},
		subwork: {
			type: GraphQLJSON,
		},
		lineFrom: {
			type: GraphQLInt,
		},
		lineTo: {
			type: GraphQLInt,
		},
		lineLetter: {
			type: GraphQLString,
		},
		nLines: {
			type: GraphQLInt,
		},
		tenantId: {
			type: GraphQLString,
		},
	},
});

export {KeywordType, KeywordInputType};
