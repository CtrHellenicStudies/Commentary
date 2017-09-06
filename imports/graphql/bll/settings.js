import Settings from '/imports/models/settings';
import AdminService from './adminService';

export default class SettingsService extends AdminService {
	constructor(props) {
		super(props);
	}

	settingsGet(tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (tenantId) {
				args.tenantId = tenantId;
			}

			return Settings.find(args).fetch();
		}
		return new Error('Not authorized');
	}
}
