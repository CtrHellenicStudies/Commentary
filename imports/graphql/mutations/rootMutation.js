import { GraphQLObjectType } from 'graphql';

import commentMutationFileds from './comments';
import annotationMutationFields from './annotations';
import bookMutationFields from './books';

/**
 * Root mutations
 * @type {GraphQLObjectType}
 */
const RootMutations = new GraphQLObjectType({
	name: 'RootMutationType',
	description: 'Root mutation object type',
	fields: {
		...commentMutationFileds,
		...annotationMutationFields,
		...bookMutationFields
	},
});

export default RootMutations;
