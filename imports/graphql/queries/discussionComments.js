/**
 * Queries for discussion comments
 */

import { GraphQLID, GraphQLList } from 'graphql';

// types
import {DiscussionCommentType} from '/imports/graphql/types/models/discussionComment';

// logic
import DiscussionCommentService from '../logic/discussionComments';

const discussionCommentQueryFields = {
	discussionComments: {
		type: new GraphQLList(DiscussionCommentType),
		description: 'Get list of all discussion comments',
		args: {
			tenantId: {
				type: GraphQLID,
			},
		},
		async resolve(parent, { tenantId }, {token}) {
			const discussionCommentService = new DiscussionCommentService({token});
			return await discussionCommentService.discussionCommentsGet(tenantId);
		},
	},
};


export default discussionCommentQueryFields;
