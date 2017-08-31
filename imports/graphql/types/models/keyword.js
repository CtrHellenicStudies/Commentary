import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLBoolean,
	GraphQLList
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import GraphQLDate from 'graphql-date';


const KeywordType = new GraphQLObjectType({
	name: 'DiscussionCommentType',
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

export default KeywordType;
