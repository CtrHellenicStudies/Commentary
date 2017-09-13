import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import {Meteor} from 'meteor/meteor';
// types
import { DiscussionCommentType, DiscussionCommentInputType} from '/imports/graphql/types/models/discussionComment';
import { RemoveType } from '/imports/graphql/types/index';

// models
import Keywords from '/imports/models/keywords';

// bll
import DiscussionCommentsService from '../bll/discussionComments';

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
			const discussionCommentsService = new DiscussionCommentsService({token});
			return await discussionCommentsService.discussionCommentUpdateStatus(discussionCommentId, discussionComment);
		}
	}
};

export default discussionCommentsMutationFields;
