import Comments from '/imports/models/comments';
import AdminService from '../adminService';
import { prepareGetCommentsOptions, prepareGetCommentsArgs } from './helper';

/**
 * Logic-layer service for dealing with comments
 */
export default class CommentService extends AdminService {

	/**
	 * Get comments for admin interface
	 * @param {string} tenantId - id of current tenant
	 * @param {number} limit - mongo orm limit
	 * @param {number} skip - mongo orm skip
	 * @param {string} workSlug - slug for work
	 * @param {string} subworkN - number of subwork
	 * @returns {Object[]} array of comments
	 */
	commentsGet(queryParam) {

		// const args = prepareGetCommentsArgs(workSlug, subworkN, tenantId);
		const options = prepareGetCommentsOptions();
		let query = JSON.parse(queryParam);
		if (queryParam === null) {
			query = {};
		}
		const comments = Comments.find(query, options).fetch();
		return comments;
	}

	/**
	 * Get comments via a start URN and end URN
	 * @param {string} urnStart - urn start range
	 * @param {string} urnEnd - urn end range
	 * @param {number} limit - mongo orm limit
	 * @param {number} skip - mongo orm skip
	 * @returns {Object[]} array of comments
	 */
	commentsGetURN(urnStart, urnEnd, limit = 20, skip = 0) {
		const args = {};
		const options = prepareGetCommentsOptions(skip, limit);

		const comments = Comments.find(args, options).fetch();
		comments.map((comment) => {
			try {
				comment.urn = JSON.parse(comment.urn);
			} catch (e) {
				console.log(e);
			}
		});
		return comments;
	}

	/**
	 * Remove a comment
	 * @param {string} _id - comment id to remove
	 * @returns {boolean} result of mongo orm remove
	 */
	commentRemove(_id) {
		if (this.userIsAdmin) {
			return Comments.remove({ _id });
		}
		return new Error('Not authorized');
	}
}
