import Settings from '/imports/models/settings';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with settings
 */
export default class SettingsService extends AdminService {

	settingsGet(_id, tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (tenantId) {
				args.tenantId = tenantId;
			}

			if (_id) {
				args._id = _id;
			}

			return Settings.find(args).fetch();
		}
		return new Error('Not authorized');
	}
	settingsUpdate(_id, settings) {
		if (this.userIsAdmin) {
			return Settings.update(_id, {$set: settings});
		}
		return new Error('Not authorized');
	}

	settingsRemove(settingsId) {
		if (this.userIsAdmin) {
			return Settings.remove({_id: settingsId});
		}
		return new Error('Not authorized');
	}

	settingsCreate(settings) {
		if (this.userIsAdmin) {
			const settingsId = Settings.insert({...settings});
			return Settings.findOne(settingsId);
		}
		return new Error('Not authorized');
	}

	settingGetPublic(tenantId) {
		const args = { tenantId };

		return Settings.findOne(args, {
			fields: {
				webhooksToken: 0,
			}
		});
	}
}
