import { GraphQLObjectType, GraphQLID } from 'graphql';



export const RemoveType = new GraphQLObjectType({
	name: 'RemoveType',
	fields: {
		_id: {
			type: GraphQLID,
		},
	},
});
