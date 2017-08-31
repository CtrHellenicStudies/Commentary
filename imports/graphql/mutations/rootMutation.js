import { GraphQLObjectType } from 'graphql';

import commentMutationFields from './comments';

/**
 * Root mutations
 * @type {GraphQLObjectType}
 */
const RootMutations = new GraphQLObjectType({
	name: 'RootMutationType',
	description: 'Root mutation object type',
	fields: {
		...commentMutationFields,
	},
});

export default RootMutations;
