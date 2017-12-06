import Settings from '/imports/models/settings';
import GraphQLService from '../graphQLService';

/**
 * Logic-layer service for dealing with settings
 */
export default class SettingsService extends GraphQLService {


	/**
	 * Get settings
	 * @param {string} _id - id of settings
	 * @param {string} tenantId - id of current tenant
	 * @returns {Object[]} array of settings
	 */
	settingsGet(_id, tenantId) {

		const args = {};

		if (tenantId) {
			args.tenantId = tenantId;
		}

		if (_id) {
			args._id = _id;
		}

		return Settings.find(args).fetch();
	}

	/**
	 * Update a settings
	 * @param {string} _id - id of settings
	 * @param {Object} settings - setting to update
	 * @returns {boolean} result from mongo orm update
	 */
	settingsUpdate(_id, settings) {
		if (this.userIsAdmin) {
			return Settings.update(_id, {$set: settings});
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a settings
	 * @param {string} settingsId - id of settings
	 * @returns {boolean} result from mongo orm remove
	 */
	settingsRemove(settingsId) {
		if (this.userIsAdmin) {
			return Settings.remove({_id: settingsId});
		}
		return new Error('Not authorized');
	}

	/**
	 * Create a settings
	 * @param {Object} settings - candidate settings record to create
	 * @returns {Object} newly created setting
	 */
	settingsCreate(settings) {
		if (this.userIsAdmin) {
			const settingsId = Settings.insert({...settings});
			return Settings.findOne(settingsId);
		}
		return new Error('Not authorized');
	}

	/**
	 * Get only the public settings for the current tenant
	 * @param {string} tenantId - id of current tenant
	 * @returns {Object} found settings record
	 */
	settingGetPublic(tenantId) {
		const args = { tenantId };

		// Ensure webhooks token is not public
		return Settings.findOne(args, {
			fields: {
				webhooksToken: 0,
			}
		});
	}
}
