import { GraphQLObjectType } from 'graphql';

import commenterQueryFields from './commenters';
import commentQueryFields from './comments';
import keywordQueryFields from './keywords';
import referenceWorkQueryFields from './referenceWorks';
import textNodeQueryFields from './textNodes';
import workQueryFields from './works';
import tenantQueryFields from './tenants';
import bookQueryFields from './books';

/**
 * Root Queries
 * @type {GraphQLObjectType}
 */
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	description: 'Root query object type',
	fields: {
		...commenterQueryFields,
		...commentQueryFields,
		...keywordQueryFields,
		...referenceWorkQueryFields,
		...textNodeQueryFields,
		...workQueryFields,
		...tenantQueryFields,
		...bookQueryFields
	},
});

export default RootQuery;
