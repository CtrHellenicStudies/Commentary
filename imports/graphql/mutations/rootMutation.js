import { GraphQLObjectType } from 'graphql';

import annotationMutationFields from './annotations';
import bookMutationFields from './books';
import commentMutationFields from './comments';
import worksMutationFields from './works';
import commenterMutationFields from './commenters';
import keywordsMutationFields from './keywords';
import referenceWorksMutationFields from './referenceWorks';
import pagesMutationFields from './pages';
import discussionCommentsMutationFields from './discussionComments';
import usersMutationFields from './users';

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
		...worksMutationFields,
		...commenterMutationFields,
		...keywordsMutationFields,
		...referenceWorksMutationFields,
		...pagesMutationFields,
		...discussionCommentsMutationFields,
		...usersMutationFields
	},
});

export default RootMutations;
