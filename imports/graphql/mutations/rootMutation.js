import { GraphQLObjectType } from 'graphql';

import commentMutationFileds from './comments';

/**
 * Root mutations
 * @type {GraphQLObjectType}
 */
const RootMutations = new GraphQLObjectType({
	name: 'RootMutationType',
	description: 'Root mutation object type',
	fields: {
		...commentMutationFileds,
	},
});

export default RootMutations;
