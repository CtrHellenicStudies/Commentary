import {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInputObjectType
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
/**
 * Edition type
 * @type {GraphQLObjectType}
 */
const EditionsInputType = new GraphQLInputObjectType({
	name: 'EditionsInputType',
	description: 'An edition input',
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

export { EditionsType, EditionsInputType };
