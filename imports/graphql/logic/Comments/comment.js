import Comments from '/imports/models/comments';
// errors
import { AuthenticationError } from '/imports/errors';

import AdminService from '../adminService';

import { prepareGetCommentsOptions, getURN } from './helper';

/**
 * Logic-layer service for dealing with comments
 */
export default class CommentService extends AdminService {

	/**
	 * Remove a comment
	 * @param {string} _id - comment id to remove
	 * @returns {boolean} result of mongo orm remove
	 */
	commentRemove(_id) {
		if (this.userIsAdmin) {
			return Comments.remove({ _id });
		}
		throw AuthenticationError();
	}
	/**
	 * Add a comment
	 * @param {object} comment - comment to insert
	 */
	commentInsert(comment) {
		if (this.userIsNobody) {
			throw AuthenticationError();
		}
		let commentId;
		let ret;
		try {
			commentId = Comments.insert({...comment});
			ret = Comments.findOne({_id: commentId});
			ret.urn = getURN(ret);
			Comments.update({_id: commentId}, {$set: {urn: ret.urn}});
		} catch (e) {
			console.log(e);
			return '';
		}
		return Comments.findOne({_id: commentId});
	}
}
