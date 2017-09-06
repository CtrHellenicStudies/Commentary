import Tenants from '/imports/models/tenants';
import AdminService from './adminService';

export default class TenantsService extends AdminService {
	constructor(props) {
		super(props);
	}

	tenantsGet(_id) {
		if (this.userIsAdmin) {
			const args = {};

			if (_id) {
				args._id = _id;
			}

			return Tenants.find(args).fetch();
		}
		return new Error('Not authorized');
	}
}
