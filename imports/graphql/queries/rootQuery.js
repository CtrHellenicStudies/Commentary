import { GraphQLObjectType } from 'graphql';

import commenterQueryFields from './commenters';
import commentQueryFields from './comments';
import keywordQueryFields from './keywords';
import referenceWorkQueryFields from './referenceWorks';
import textNodeQueryFields from './textNodes';
import workQueryFields from './works';

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
	},
});

export default RootQuery;
