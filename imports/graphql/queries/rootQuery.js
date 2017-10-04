import { GraphQLObjectType } from 'graphql';

import annotationQueryFields from './annotations';
import commenterQueryFields from './commenters';
import commentQueryFields from './comments';
import keywordQueryFields from './keywords';
import referenceWorkQueryFields from './referenceWorks';
import textNodeQueryFields from './textNodes';
import workQueryFields from './works';
import tenantQueryFields from './tenants';
import bookQueryFields from './books';
import discussionCommentQueryFields from './discussionComments';
import linkedDataSchemaFields from './linkedDataSchema';
import pagesQueryFields from './pages';
import settingsQueryFields from './settings';
import translationsQueryFields from './translation';
import editionsQueryFields from './editions';
import usersQueryFields from './users';

/**
 * Root Queries
 * @type {GraphQLObjectType}
 */
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	description: 'Root query object type',
	fields: {
		...annotationQueryFields,
		...commenterQueryFields,
		...commentQueryFields,
		...keywordQueryFields,
		...referenceWorkQueryFields,
		...textNodeQueryFields,
		...workQueryFields,
		...tenantQueryFields,
		...bookQueryFields,
		...discussionCommentQueryFields,
		...linkedDataSchemaFields,
		...pagesQueryFields,
		...settingsQueryFields,
		...translationsQueryFields,
		...editionsQueryFields,
		...usersQueryFields,
	},
});

export default RootQuery;
