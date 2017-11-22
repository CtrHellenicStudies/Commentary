/**
 * Mutations for comments
 */

import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import CommentType, { CommentInputType } from '/imports/graphql/types/models/comment';
import { RemoveType } from '/imports/graphql/types/index';

// models
import Comments from '/imports/models/comments';

// errors
import { AuthenticationError } from '/imports/errors';

// logic
import CommentsService from '../logic/Comments/comments';


const commentMutationFields = {
	commentInsert: {
		type: CommentType,
		description: 'Create new comment',
		args: {
			comment: {
				type: new GraphQLNonNull(CommentInputType)
			}
		},
		async resolve(parent, {comment}, {token}) {
			const commentsService = new CommentsService({token});
			return await commentsService.commentInsert(comment);
		}
	},
	commentRemove: {
		type: RemoveType,
		description: 'Remove a single comment',
		args: {
			commentId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {commentId}, {token}) {
			const commentsService = new CommentsService({token});
			return await commentsService.commentRemove(commentId);
		}
	}
};

export default commentMutationFields;
