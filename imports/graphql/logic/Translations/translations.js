import TranslationNodes from '/imports/models/translationNodes';
import AdminService from '../adminService';

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
		const args = {};

		if (tenantId) {
			args.tenantId = tenantId;
		}

		return TranslationNodes.find(args).fetch();
	}
}
