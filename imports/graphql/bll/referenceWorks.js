import ReferenceWorks from '/imports/models/referenceWorks';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with reference works
 */
export default class ReferenceWorksService extends AdminService {

	/**
	 * Get reference works
	 * @param {string} id - id of reference work
	 * @param {string} tenantId - id of current tenant
	 * @returns {Object[]} array of reference works
	 */
	referenceWorksGet(id, tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (tenantId) {
				args.tenantId = tenantId;
			}
			if (id) {
				args._id = id;
			}

			return ReferenceWorks.find(args, {
				sort: {
					slug: 1
				}
			}).fetch();
		}
		return new Error('Not authorized');
	}


	/**
	 * Remove a reference work
	 * @param {string} referenceWorkId - id of reference work
	 * @returns {boolean} result from mongo orm remove
	 */
	referenceWorkRemove(referenceWorkId) {
		if (this.userIsAdmin) {
			return ReferenceWorks.remove({_id: referenceWorkId});
		}
		return new Error('Not authorized');
	}

	/**
	 * Update a reference work
	 * @param {string} referenceWorkId - id of reference work
	 * @param {Object} referenceWork - reference work to update
	 * @returns {boolean} result from mongo orm update
	 */
	referenceWorkUpdate(referenceWorkId, referenceWork) {
		if (this.userIsAdmin) {
			return ReferenceWorks.update(referenceWorkId, {$set: referenceWork});
		}
		return new Error('Not authorized');
	}

	/**
	 * Create a reference work
	 * @param {Object} referenceWork - candidate reference work to create
	 * @returns {Object} newly created reference work 
	 */
	referenceWorkCreate(referenceWork) {
		if (this.userIsAdmin) {
			const referenceWorkId = ReferenceWorks.insert({...referenceWork});
			return ReferenceWorks.findOne(referenceWorkId);
		}
		return new Error('Not authorized');
	}
}
