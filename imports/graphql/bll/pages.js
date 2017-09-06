import Pages from '/imports/models/pages';
import AdminService from './adminService';

export default class PageService extends AdminService {
	constructor(props) {
		super(props);
	}

	pagesGet(tenantId) {
		if (this.userIsAdmin) {
			const args = {};
			if (tenantId) {
				args.tenantId = tenantId;
			}
			return Pages.find(args).fetch()
		}
		return new Error('Not authorized');
	}
}
