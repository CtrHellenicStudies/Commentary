/**
 * Mutations for comments
 */

import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import CommentType from '/imports/graphql/types/models/comment';
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
			title: {
				type: new GraphQLNonNull(GraphQLString),
			},
			content: {
				type: new GraphQLNonNull(GraphQLString),
			},
			commenter: {
				type: new GraphQLNonNull(GraphQLString),
			},
		},
		resolve(parent, { title, content }, { user, tenant }) {

			// only a logged in user and coming from the admin page, can create new project
			if (user && tenant.adminPage) {
				return Comments.insert({
					tenantId: tenant._id,
					title,
					description,
				});
			}

			throw AuthenticationError();
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
