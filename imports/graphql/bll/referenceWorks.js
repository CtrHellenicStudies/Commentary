import ReferenceWorks from '/imports/models/referenceWorks';
import AdminService from './adminService';

export default class ReferenceWorksService extends AdminService {
	constructor(props) {
		super(props);
	}

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

	referenceWorkRemove(referenceWorkId) {
		if (this.userIsAdmin) {
			return ReferenceWorks.remove({_id: referenceWorkId});
		}
		return new Error('Not authorized');
	}
}
