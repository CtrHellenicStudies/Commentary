import Commenters from '/imports/models/commenters';
import AdminService from './adminService';

export default class CommentService extends AdminService {
	constructor(props) {
		super(props);
	}

	commentersGet(tenantId) {
		if (this.userIsAdmin) {
			const args = {};
			if (tenantId) {
				args.tenantId = tenantId;
			}

			return Commenters.find(args, {
				sort: {
					slug: 1
				},
			}).fetch();
		}
		return new Error('Not authorized');
	}
}
