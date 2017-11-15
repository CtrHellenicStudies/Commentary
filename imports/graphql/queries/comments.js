/**
 * Queries for comments
 */

import { GraphQLID, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';

// types
import CommentType from '/imports/graphql/types/models/comment';

// logic
import CommentService from '../logic/comments';

const commentQueryFields = {
	comments: {
		type: new GraphQLList(CommentType),
		description: 'Get list of all comments by tenant or for a specific work/passage',
		args: {
			tenantId: {
				type: GraphQLID,
			},
			limit: {
				type: GraphQLInt,
			},
			skip: {
				type: GraphQLInt,
			},
			workSlug: {
				type: GraphQLString,
			},
			subworkN: {
				type: GraphQLInt,
			},
			lineFrom: {
				type: GraphQLInt,
			},
			lineTo: {
				type: GraphQLInt,
			},
			isAnnotation: {
				type: GraphQLBoolean,
			}
		},
		async resolve(parent, { tenantId, limit, skip, workSlug, subworkN }, {token}) {
			const commentService = new CommentService({token});
			return await commentService.commentsGet(tenantId, limit, skip, workSlug, subworkN);
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
			console.log(urnStart);
			console.log(urnEnd);
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
			console.log(urnStart);
			console.log(urnEnd);
			const commentService = new CommentService({ token });
			return await commentService.commentsGetURN(urnStart, urnEnd, limit, skip);
		}
	},
};

export default commentQueryFields;
