import Pages from '/imports/models/pages';
import AdminService from './adminService';

export default class PageService extends AdminService {
	constructor(props) {
		super(props);
	}

	pagesGet(_id, tenantId) {
		if (this.userIsAdmin) {
			const args = {};
			if (tenantId) {
				args.tenantId = tenantId;
			}
			if (_id) {
				args._id = _id;
			}
			return Pages.find(args).fetch();
		}
		return new Error('Not authorized');
	}

	pageUpdate(_id, page) {
		if (this.userIsAdmin) {
			return Pages.update(_id, {$set: page});
		}
		return new Error('Not authorized');
	}

	pageRemove(pageId) {
		if (this.userIsAdmin) {
			return Pages.remove({_id: pageId});
		}
		return new Error('Not authorized');
	}

	pageCreate(page) {
		if (this.userIsAdmin) {
			const pageId = Pages.insert({...page});
			return Pages.findOne(pageId);
		}
		return new Error('Not authorized');
	}
}
