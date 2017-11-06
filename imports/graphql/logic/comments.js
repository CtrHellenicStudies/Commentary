import Comments from '/imports/models/comments';
import AdminService from './adminService';

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
	commentsGet(tenantId, limit, skip, workSlug, subworkN) {
		if (this.userIsAdmin) {
			const args = {};

			const options = {
				sort: {
					'work.order': 1,
					'subwork.n': 1,
					lineFrom: 1,
					nLines: -1,
				},
			};
			if ('work' in args) {
				args['work.slug'] = slugify(workSlug);
			}
			if ('subwork' in args) {
				args['subwork.n'] = subworkN;
			}

			if (tenantId) {
				args.tenantId = tenantId;
			}

			if (skip) {
				options.skip = skip;
			} else {
				options.skip = 0;
			}

			if (limit) {
				if (limit > 100) {
					options.limit = 100;
				}
				options.limit = limit;
			} else {
				options.limit = 30;
			}

			return Comments.find(args, options).fetch();
		}
		return new Error('Not authorized');
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

		const options = {
			sort: {
				'work.order': 1,
				'subwork.n': 1,
				lineFrom: 1,
				nLines: -1,
			},
			skip,
			limit,
		};

		return Comments.find(args, options).fetch();
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
