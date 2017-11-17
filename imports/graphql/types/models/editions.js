import {
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';

/**
 * Edition type
 * @type {GraphQLObjectType}
 */
const EditionsType = new GraphQLObjectType({
	name: 'EditionsType',
	description: 'An edition',
	fields: {
		_id: {
			type: GraphQLString,
		},
		title: {
			type: GraphQLString
		},
		slug: {
			type: GraphQLString
		}
	}
});

export { EditionsType };
