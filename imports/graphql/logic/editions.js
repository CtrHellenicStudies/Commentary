import Editions from '/imports/models/editions';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with editions
 */
export default class EditionsService extends AdminService {

	/**
	 * Get editions
	 * @param {string} editionId - id of edition
	 * @returns {Object[]} array of editions
	 */
	editionsGet(editionId) {
		if (this.userIsAdmin) {
			const args = {};

			if (editionId) {
				args._id = tenantId;
			}

			return Editions.find(args).fetch();
		}
		return new Error('Not authorized');
	}
}
