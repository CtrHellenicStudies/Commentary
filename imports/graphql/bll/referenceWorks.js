import ReferenceWorks from '/imports/models/referenceWorks';
import AdminService from './adminService';

export default class ReferenceWorksService extends AdminService {
	constructor(props) {
		super(props);
	}

	referenceWorksGet(tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (tenantId) {
				args.tenantId = tenantId;
			}

			return ReferenceWorks.find(args, {
				sort: {
					slug: 1
				}
			}).fetch();
		}
		return new Error('Not authorized');
	}
}
