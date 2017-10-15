import ReferenceWorks from '/imports/models/referenceWorks';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with reference works
 */
export default class ReferenceWorksService extends AdminService {

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

	referenceWorkUpdate(referenceWorkId, referenceWork) {
		if (this.userIsAdmin) {
			return ReferenceWorks.update(referenceWorkId, {$set: referenceWork});
		}
		return new Error('Not authorized');
	}

	referenceWorkCreate(referenceWork) {
		if (this.userIsAdmin) {
			const referenceWorkId = ReferenceWorks.insert({...referenceWork});
			return ReferenceWorks.findOne(referenceWorkId);
		}
		return new Error('Not authorized');
	}
}
