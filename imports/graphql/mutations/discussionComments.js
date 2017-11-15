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
import DiscussionCommentService from '../logic/discussionComments';

const discussionCommentsMutationFields = {
	discussionCommentUpdateStatus: {
		type: DiscussionCommentType,
		description: 'Update a discussion comment status',
		args: {
			discussionCommentId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			discussionComment: {
				type: new GraphQLNonNull(DiscussionCommentInputType)
			}
		},
		async resolve(parent, {discussionCommentId, discussionComment}, {token}) {
			const discussionCommentsService = new DiscussionCommentService({token});
			return await discussionCommentsService.discussionCommentUpdateStatus(discussionCommentId, discussionComment);
		}
	},
	discussionCommentUpdate:{
		type: DiscussionCommentType,
		description: 'Update a discussion comment content',
		args:{
			discussionCommentId: {
				type: new GraphQLNonNull(GraphQLString)
			},
			discussionContent: {
				type: new GraphQLNonNull(GraphQLString)
			}
		},
		async resolve(parent, {discussionCommentId, discussionContent}, {token}){
			const discussionCommentsService = new DiscussionCommentService({token});
			return await discussionCommentsService.discussionCommentUpdate(discussionCommentId,discussionContent);
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
	}
};

export default discussionCommentsMutationFields;
