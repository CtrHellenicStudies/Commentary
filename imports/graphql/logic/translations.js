import Translation from '/imports/models/translations';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with translations
 */
export default class TranslationsService extends AdminService {

	/**
	 * DEPRECATED
	 * Get translations
	 * @param {string} tenantId - id of current tenant
	 * @returns {Object[]} array of translations 
	 */
	translationGet(tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (tenantId) {
				args.tenantId = tenantId;
			}

			return Translation.find(args).fetch();
		}
		return new Error('Not authorized');
	}
}
