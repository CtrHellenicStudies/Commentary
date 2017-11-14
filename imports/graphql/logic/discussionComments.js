import DiscussionComments from '/imports/models/discussionComments';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with discussion comments
 */
export default class DiscussionCommentService extends AdminService {

	/**
	 * Get discussion comments
	 * @param {string} tenantId - the id of the current tenant
	 * @returns {Object[]} array of discussion comments
	 */
	discussionCommentsGet(tenantId) {
		if (this.userIsAdmin) {

			const args = {};
			if (tenantId) {
				args.tenantId = tenantId;
			}

			return DiscussionComments.find(args).fetch();
		}
		return new Error('Not authorized');
	}

	/**
	 * Update the status of a given discussion comment
	 * @param {string} discussionCommentId - id of dicussion comment to update
	 * @param {Object} discussionComment - discussion comment update candidate
	 * @returns {Object} updated discussion comment
	 */
	discussionCommentUpdateStatus(discussionCommentId, discussionComment) {
		if (this.userIsAdmin) {
			DiscussionComments.update({
				_id: discussionCommentId,
			}, {
				$set: {
					status: discussionComment.status,
				},
			});
			return DiscussionComments.findOne(discussionCommentId);
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a discussion comment
	 * @param {string} discussionCommentId - id of dicussion comment to remove
	 * @returns {boolean} result of mongo orm remove
	 */
	discussionCommentRemove(discussionCommentId) {
		console.log(this);
		if (this.userIsAdmin) {
			return DiscussionComments.remove({_id: discussionCommentId});
		}
		return new Error('Not authorized');
	}
	/**
	 * Update discussion comment content
	 * @param {number} discussionCommentId - id of discussion comment to update
	 * @param {object} discussionComment - discussion comment object with content
	 */
	discussionCommentUpdate(discussionCommentId, discussionComment){
		if (!this.userIsAdmin) 
			return new Error('Not authorized');
		try {
			DiscussionComments.update({_id: discussionCommentId},
				{$set: {
					content: discussionComment.content
				}
			});
		}
		catch(e){
			throw new Error(e);
		}

		
	}
}
