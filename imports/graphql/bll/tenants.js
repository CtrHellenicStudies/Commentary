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

	tenantUpdate(_id, tenant) {
		if (this.userIsAdmin) {
			Tenants.update(_id, {$set: tenant});
			return Tenants.findOne(_id);
		}
		return new Error('Not authorized');
	}

	tenantRemove(tenantId) {
		if (this.userIsAdmin) {
			return Tenants.remove({_id: tenantId});
		}
		return new Error('Not authorized');
	}

	tenantCreate(tenant) {
		if (this.userIsAdmin) {
			const tenantId = Tenants.insert({...tenant});
			return Tenants.findOne(tenantId);
		}
		return new Error('Not authorized');
	}
}
