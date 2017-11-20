/**
 * Mutations for discussion comments
 */

import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { Meteor } from 'meteor/meteor';

// types
import { DiscussionCommentType, DiscussionCommentInputType} from '/imports/graphql/types/models/discussionComment';
import { RemoveType } from '/imports/graphql/types/index';

// models
import Keywords from '/imports/models/keywords';

// logic
import DiscussionCommentService from '../logic/DiscussionComments/discussionComments';

const discussionCommentsMutationFields = {
	discussionCommentUpdateStatus: {
		type: DiscussionCommentType,
		description: 'Update a discussion comment status',
		args: {
			discussionCommentId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			discussionCommentStatus: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {discussionCommentId, discussionCommentStatus}, {token}) {
			const discussionCommentsService = new DiscussionCommentService({token});
			return await discussionCommentsService.discussionCommentUpdateStatus(discussionCommentId, discussionCommentStatus);
		}
	},
	discussionCommentUpdate: {
		type: DiscussionCommentType,
		description: 'Update a discussion comment content',
		args: {
			discussionCommentId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			discussionContent: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {discussionCommentId, discussionContent}, {token}) {
			const discussionCommentsService = new DiscussionCommentService({token});
			return await discussionCommentsService.discussionCommentUpdate(discussionCommentId, discussionContent);
		}
	},
	discussionCommentRemove: {
		type: RemoveType,
		description: 'Remove a single discussionComment',
		args: {
			discussionCommentId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {discussionCommentId}, {token}) {
			const discussionCommentsService = new TenantsService({token});
			return await discussionCommentsService.discussionCommentRemove(discussionCommentId);
		}
	},
	discussionCommentReport: {
		type: DiscussionCommentType,
		description: 'Report discussionComment',
		args: {
			discussionCommentId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {discussionCommentId}, {token}) {
			const discussionCommentsService = new DiscussionCommentService({token});
			return await discussionCommentsService.discussionCommentReport(discussionCommentId);
		}
	},
	discussionCommentInsert: {
		type: DiscussionCommentType,
		description: 'Report discussionComment',
		args: {
			commentId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			discussionContent: {
				type: new GraphQLNonNull(GraphQLString)
			},
			tenantId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {commentId, discussionContent, tenantId}, {token}) {
			const discussionCommentsService = new DiscussionCommentService({token});
			return await discussionCommentsService.discussionCommentInsert(commentId, discussionContent, tenantId);
		}
	},
	discussionCommentUnreport: {
		type: DiscussionCommentType,
		description: 'Undo your report',
		args: {
			discussionCommentId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {discussionCommentId}, {token}) {
			const discussionCommentsService = new DiscussionCommentService({token});
			return await discussionCommentsService.discussionCommentUnreport(discussionCommentId);
		}
	},
	discussionCommentUpvote: {
		type: DiscussionCommentType,
		description: 'Vote for this discussionComment',
		args: {
			discussionCommentId: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {discussionCommentId}, {token}) {
			const discussionCommentsService = new DiscussionCommentService({token});
			return await discussionCommentsService.discussionCommentUpvote(discussionCommentId);
		}
	}
};

export default discussionCommentsMutationFields;
