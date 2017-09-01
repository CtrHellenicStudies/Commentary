import { GraphQLObjectType } from 'graphql';

import annotationMutationFields from './annotations';
import commentMutationFields from './comments';

/**
 * Root mutations
 * @type {GraphQLObjectType}
 */
const RootMutations = new GraphQLObjectType({
	name: 'RootMutationType',
	description: 'Root mutation object type',
	fields: {
		...annotationMutationFields,
		...commentMutationFields,
	},
});

export default RootMutations;
