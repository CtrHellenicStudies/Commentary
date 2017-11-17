import Commenters from '/imports/models/commenters';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with commenters
 */
export default class CommentService extends AdminService {

	/**
	 * Get commenters for the supplied _id and tenantId
	 * @param {string} _id - commenter id
	 * @param {string} tenantId - id for current tenant
	 * @returns {Object[]} array of commenters
	 */
	commentersGet(_id, tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (_id) {
				args._id = _id;
			}
			if (tenantId) {
				args.tenantId = tenantId;
			}

			return Commenters.find(args, {
				sort: {
					slug: 1
				},
			}).fetch();
		}
		return new Error('Not authorized');
	}

	/**
	 * Update a commenter
	 * @param {string} _id - commenter id
	 * @param {Object} commenter - the updated commenter record
	 * @returns {boolean} the mongo orm update response
	 */
	commenterUpdate(_id, commenter) {
		if (this.userIsAdmin) {
			return Commenters.update(_id, {$set: commenter});
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a commenter
	 * @param {string} commenterId - id of the commenter to remove
	 * @returns {boolean} the mongo orm remove response
	 */
	commenterRemove(commenterId) {
		if (this.userIsAdmin) {
			return Commenters.remove({_id: commenterId});
		}
		return new Error('Not authorized');
	}

	/**
	 * Create a new commenter
	 * @param {Object} commenter - the new commenter candidate 
	 * @returns {Object} the newly created commenter record
	 */
	commenterCreate(commenter) {
		if (this.userIsAdmin) {
			const commenterId = Commenters.insert({...commenter});
			return Commenters.findOne(commenterId);
		}
		return new Error('Not authorized');
	}
}
