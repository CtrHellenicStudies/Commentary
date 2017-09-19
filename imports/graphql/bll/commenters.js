import Commenters from '/imports/models/commenters';
import AdminService from './adminService';

export default class CommentService extends AdminService {
	constructor(props) {
		super(props);
	}

	commentersGet(_id, tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (_id) {
				args._id = _id;
			}
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

	commenterUpdate(_id, commenter) {
		if (this.userIsAdmin) {
			return Commenters.update(_id, {$set: commenter});
		}
		return new Error('Not authorized');
	}

	commenterRemove(commenterId) {
		if (this.userIsAdmin) {
			return Commenters.remove({_id: commenterId});
		}
		return new Error('Not authorized');
	}

	commenterCreate(commenter) {
		if (this.userIsAdmin) {
			const commenterId = Commenters.insert({...commenter});
			return Commenters.findOne(commenterId);
		}
		return new Error('Not authorized');
	}
}
