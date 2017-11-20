import DiscussionComments from '/imports/models/discussionComments';
import Comments from '/imports/models/comments';
import AdminService from '../adminService';
import { sendReportMessage } from './helper';

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

		const args = {};
		if (tenantId) {
			args.tenantId = tenantId;
		}

		return DiscussionComments.find(args).fetch();
	}
	/**
	 * Update the status of a given discussion comment
	 * @param {string} discussionCommentId - id of dicussion comment to update
	 * @param {Object} discussionCommentStatus - discussion comment update candidate
	 * @returns {Object} updated discussion comment
	 */
	discussionCommentUpdateStatus(discussionCommentId, discussionCommentStatus) {
		console.log(discussionCommentStatus);
		if (!this.userIsAdmin) {
			return 'Not authorized';
		}
		
		DiscussionComments.update({
			_id: discussionCommentId
		}, {
			$set: {
				status: discussionCommentStatus,
			},
		});
		return DiscussionComments.findOne(discussionCommentId);
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
		return 'Not authorized';
	}
	/**
	 * Update discussion comment content
	 * @param {string} discussionCommentId - id of discussion comment to update
	 * @param {string} discussionContent - content of disscusion comment
	 */
	discussionCommentUpdate(discussionCommentId, discussionContent) {

		if (this.userIsNobody) {
			return 'Not authorized';
		}

		try {
			DiscussionComments.update({_id: discussionCommentId, userId: this.user._id},
				{
					$set: {
						content: discussionContent
					}
				});
		}		catch (e) {
			throw e;
		}	
	}
	/**
	 * Report selected discussionComment
	 * @param {string} discussionCommentId - id of the comment to report 
	 */
	discussionCommentReport(discussionCommentId) {

		if (this.userIsNobody) {
			return new Error('Not authorized');
		}

		const discussionComment = DiscussionComments.findOne(discussionCommentId);
		const comment = Comments.findOne(discussionComment.commentId);
	
		// Make sure the user has not already reported this comment
		if ('usersReported' in discussionComment
			&& discussionComment.usersReported.indexOf(this.user._id >= 0)) {
			throw new Error('Already reported by this user.');
		}
	
		try {
			if ('usersReported' in discussionComment) {
				DiscussionComments.update({
					_id: discussionCommentId,
				}, {
					$push: { usersReported: this.user._id },
					$inc: { reported: 1 },
				});
			} else {
				DiscussionComments.update({
					_id: discussionCommentId,
				}, {
					$set: {
						reported: 1,
						usersReported: [this.user._id],
					},
				});
			}
		} catch (err) {
			throw err;
		}
		sendReportMessage(comment, discussionComment);
	}
	/**
	 * Undo report on selected discussionComment
	 * @param {string} discussionCommentId - id of the comment to udno report
	 */
	discussionCommentUnreport(discussionCommentId) {

		if (this.userIsNobody) {
			return new Error('Not authorized');
		}

		const discussionComment = DiscussionComments.findOne(discussionCommentId);
		
		try {
			if ('usersReported' in discussionComment) {
				DiscussionComments.update({
					_id: discussionCommentId,
				}, {
					$pull: { usersReported: this.user._id },
					$inc: { reported: -1 },
				});
			}
		} catch (err) {
			throw err;
		}
	}
	/**
	 * Upvote on selected discussionComment
	 * @param {string} discussionCommentId - id of the comment to upvote
	 */
	discussionCommentUpvote(discussionCommentId) {
		const discussionComment = DiscussionComments.findOne(discussionCommentId);
		
		if (this.userIsNobody || 
			discussionComment.voters.indexOf(this.user._id) >= 0) {
			return 'Not authorized'; 
		}

		try {
			DiscussionComments.update({
				_id: discussionCommentId,
			}, {
				$push: { voters: this.user._id },
				$inc: { votes: 1 },
			});
		} catch (err) {
			throw err;
		}
	}
	/**
	 * Insert new discussionComment
	 * @param {string} discussionContent - content of disscusion comment, which will be inserted
	 */
	discussionCommentInsert(discussionContent, commentId, tenantId) {

		if (this.userIsNobody) {
			return new Error('not authorized');
		}
		const commentsInDiscussion = DiscussionComments.find({commentId: commentId}).fetch();

		const discussionComment = {
			commentId: commentId,
			tenantId: tenantId,
			content: discussionContent,
			userId: this.user._id,
			votes: 1,
			voters: [this.user._id],
			status: 'pending'
		};
	
		// check if discussion comments for this comment have not been disabled:
		const comment = Comments.findOne({_id: commentId});
		if (comment.discussionCommentsDisabled) throw new Error('insert denied - discussionCommentsDisabled');
	
		try {
			DiscussionComments.insert(discussionComment);
		} catch (err) {
			throw new Error(err);
		}
	}
}
