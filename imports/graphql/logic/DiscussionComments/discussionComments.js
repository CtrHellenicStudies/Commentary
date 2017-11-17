import DiscussionComments from '/imports/models/discussionComments';
import AdminService from '../adminService';

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
		//if (this.userIsCommenter) {

			const args = {};
			if (tenantId) {
				args.tenantId = tenantId;
			}

			return DiscussionComments.find(args).fetch();
		//}
		//return new Error('Not authorized');
	}

	/**
	 * Update the status of a given discussion comment
	 * @param {string} discussionCommentId - id of dicussion comment to update
	 * @param {Object} discussionComment - discussion comment update candidate
	 * @returns {Object} updated discussion comment
	 */
	discussionCommentUpdateStatus(discussionCommentId, discussionComment) {
		if (!this.userIsNobody) {
			DiscussionComments.update({
				_id: discussionCommentId,
				userId: this.user._id
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
		if (this.userIsAdmin) {
			return DiscussionComments.remove({_id: discussionCommentId});
		}
		return new Error('Not authorized');
	}
	/**
	 * Update discussion comment content
	 * @param {string} discussionCommentId - id of discussion comment to update
	 * @param {string} discussionContent - contentr of disscusion comment
	 */
	discussionCommentUpdate(discussionCommentId, discussionContent){
		if(this.userIsNobody) 
			return new Error('Not authorized');
		try {
			DiscussionComments.update({_id: discussionCommentId, userId: this.user._id},
				{
					$set: {
						content: discussionContent
					}
				});
		}
		catch(e){
			throw new Error(e);
		}

		
	}
	/**
	 * Report selected discussionComment
	 * @param {String} discussionCommentId - id of the comment to report 
	 */
	discussionCommentReport(discussionCommentId){
		if(this.userIsNobody)
			return new Error('Not authorized');
		try{
			
		}
		catch(e){
			throw new Error(e);
		}
	}
	/**
	 * Undo report on selected discussionComment
	 * @param {String} discussionCommentId - id of the comment to udno report
	 */
	discussionCommentUnreport(discussionCommentId){
		if(this.userIsNobody)
			return new Error('Not authorized');
		try{
			
		}
		catch(e){
			throw new Error(e);
		}
	}
	/**
	 * Upvote on selected discussionComment
	 * @param {String} discussionCommentId - id of the comment to upvote
	 */
	discussionCommentUpvote(discussionCommentId){
		if(this.userIsNobody)
			return new Error('Not authorized');
		try{
			
		}
		catch(e){
			throw new Error(e);
		}
	}
}
