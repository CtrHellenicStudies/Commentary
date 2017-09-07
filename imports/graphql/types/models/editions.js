import {
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';

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

export {EditionsType};
