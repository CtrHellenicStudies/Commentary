/**
 * Mutations for comments
 */

import { GraphQLString, GraphQLNonNull } from 'graphql';

// types
import CommentType, { CommentInputType } from '/imports/graphql/types/models/comment';
import { RevisionInputType } from '/imports/graphql/types/models/revision';
import { RemoveType } from '/imports/graphql/types/index';


// errors
import { AuthenticationError } from '/imports/errors';

// logic
import CommentService from '../logic/Comments/comment';


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
			const commentsService = new CommentService({token});
			return await commentsService.commentInsert(comment);
		}
	},
	commentUpdate: {
		type: CommentType,
		description: 'Update comment',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			},
			comment: {
				type: new GraphQLNonNull(CommentInputType)
			}
		},
		async resolve(parent, {id, comment}, {token}) {
			const commentsService = new CommentService({token});
			return await commentsService.commentUpdate(id, comment);
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
			const commentsService = new CommentService({token});
			return await commentsService.commentRemove(commentId);
		}
	},
	commentInsertRevision: {
		type: CommentType,
		description: 'Add new revision',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			},
			revision: {
				type: new GraphQLNonNull(RevisionInputType)
			}
		},
		async resolve(parent, {id, revision}, {token}) {
			const commentsService = new CommentService({token});
			return await commentsService.addRevision(id, revision);
		}
	},
	commentRemoveRevision: {
		type: RemoveType,
		description: 'Remove a single comment',
		args: {
			id: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {id}, {token}) {
			const commentsService = new CommentService({token});
			return await commentsService.removeRevision(id);
		}
	}
};

export default commentMutationFields;
