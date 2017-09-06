import DiscussionComments from '/imports/models/discussionComments';
import AdminService from './adminService';

export default class DiscussionCommentService extends AdminService {
	constructor(props) {
		super(props);
	}

	discussionCommentsGet(tenantId) {
		if (this.userIsAdmin) {

			const args = {};
			if (tenantId) {
				args.tenantId = tenantId;
			}

			return DiscussionComments.find(args).fetch();
		}
		return new Error('Not authorized');
	}
}
