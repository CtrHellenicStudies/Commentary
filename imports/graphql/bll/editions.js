import Editions from '/imports/models/editions';
import AdminService from './adminService';

export default class EditionsService extends AdminService {
	constructor(props) {
		super(props);
	}

	editionsGet(editionId) {
		if (this.userIsAdmin) {
			const args = {};

			if (editionId) {
				args._id = tenantId;
			}

			return Editions.find(args).fetch();
		}
		return new Error('Not authorized');
	}
}
