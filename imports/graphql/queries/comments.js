/**
 * Queries for comments
 */

import { GraphQLID, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';

// types
import CommentType from '/imports/graphql/types/models/comment';

// logic
import CommentService from '../logic/Comments/comments';

const commentQueryFields = {
	comments: {
		type: new GraphQLList(CommentType),
		description: 'Get list of all comments by tenant or for a specific work/passage',
		args: {
			queryParam: {
				type: GraphQLString,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
		},
		async resolve(parent, { queryParam, limit, skip}, {token}) {
			const commentService = new CommentService({token});
			return await commentService.commentsGet(queryParam, limit, skip);
		}
	},
	commentsMore: {
		type: GraphQLBoolean,
		description: 'Find if there is more comments to take',
		args: {
			queryParam: {
				type: GraphQLString,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
		},
		async resolve(parent, { queryParam, limit, skip}, {token}) {
			const commentService = new CommentService({token});
			return await commentService.commentsGetMore(queryParam, limit, skip);
		}
	},
	commentsOn: {
		type: new GraphQLList(CommentType),
		description: 'Get list of comments provided at least a startURN and paginated via skip/limit. Relates a scholion to the passage of text it comments on.',
		args: {
			urnStart: {
				type: GraphQLString,
				required: true,
			},
			urnEnd: {
				type: GraphQLString,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
		},
		async resolve(parent, { urnStart, urnEnd, limit, skip }, { token }) {
			const commentService = new CommentService({ token });
			return await commentService.commentsGetURN(urnStart, urnEnd, limit, skip);
		}
	},
	commentedOnBy: {
		type: new GraphQLList(CommentType),
		description: 'Get list of comments provided at least a startURN and paginated via skip/limit. Relates a passage of text to a scholion commenting on it.',
		args: {
			urnStart: {
				type: GraphQLString,
				required: true,
			},
			urnEnd: {
				type: GraphQLString,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
		},
		async resolve(parent, { urnStart, urnEnd, limit, skip }, { token }) {
			const commentService = new CommentService({ token });
			return await commentService.commentsGetURN(urnStart, urnEnd, limit, skip);
		}
	},
};

export default commentQueryFields;
