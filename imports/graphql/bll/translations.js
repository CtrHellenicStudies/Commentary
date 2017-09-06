import Translation from '/imports/models/translations';
import AdminService from './adminService';

export default class TranslationsService extends AdminService {
	constructor(props) {
		super(props);
	}

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
