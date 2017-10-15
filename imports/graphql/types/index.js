import { GraphQLObjectType, GraphQLID } from 'graphql';


/**
 * Remove type
 * @type {GraphQLObjectType}
 */
export const RemoveType = new GraphQLObjectType({
	name: 'RemoveType',
	fields: {
		_id: {
			type: GraphQLID,
		},
	},
});
