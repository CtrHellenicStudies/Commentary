import Keywords from '/imports/models/keywords';
import AdminService from './adminService';

export default class KeywordsService extends AdminService {
	constructor(props) {
		super(props);
	}

	keywordsGet(tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (tenantId) {
				args.tenantId = tenantId;
			}
			return Keywords.find(args, {
				sort: {
					slug: 1,
				}
			}).fetch();
		}
		return new Error('Not authorized');
	}

	keywordRemove(keywordId) {
		if (this.userIsAdmin) {
			return Keywords.remove({_id: keywordId});
		}
		return new Error('Not authorized');
	}
}
