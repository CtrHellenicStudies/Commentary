import LinkedDataSchema from '/imports/models/linkedDataSchemas';
import AdminService from './adminService';

export default class KeywordsService extends AdminService {
	constructor(props) {
		super(props);
	}

	linkedDataSchemaGet(tenantId) {
		if (this.userIsAdmin) {
			const args = {};

			if (tenantId) {
				args.tenantId = tenantId;
			}
			return LinkedDataSchema.find(args, {
				sort: {
					slug: 1,
				}
			}).fetch();
		}
		return new Error('Not authorized');
	}
}
