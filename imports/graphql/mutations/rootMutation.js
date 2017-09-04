import { GraphQLObjectType } from 'graphql';

import annotationMutationFields from './annotations';
import bookMutationFields from './books';
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
		...bookMutationFields,
		...commentMutationFields,
	},
});

export default RootMutations;
