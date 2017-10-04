import LinkedDataSchema from '/imports/models/linkedDataSchemas';
import AdminService from './adminService';

export default class LinkedDataSchemaService extends AdminService {
	constructor(props) {
		super(props);
	}

	linkedDataSchemaGet(id) {
		if (this.userIsAdmin) {
			const args = {};

			if (id) {
				args._id = id;
			}
			return LinkedDataSchema.find(args, {
				sort: {
					slug: 1,
				}
			}).fetch();
		}
		return new Error('Not authorized');
	}

	linkedDataSchemaRemove(id) {
		if (this.userIsAdmin) {
			return LinkedDataSchema.remove({_id: id});
		}
		return new Error('Not authorized');
	}

	linkedDataSchemaUpdate(linkedDataSchemaId, linkedDataSchema) {
		if (this.userIsAdmin) {
			LinkedDataSchema.update(linkedDataSchemaId, {$set: linkedDataSchema});
			return LinkedDataSchema.findOne(linkedDataSchemaId);
		}
		return new Error('Not authorized');
	}

	linkedDataSchemaCreate(linkedDataSchema) {
		if (this.userIsAdmin) {
			const linkedDataSchemaId = LinkedDataSchema.insert({...linkedDataSchema});
			return LinkedDataSchema.findOne(linkedDataSchemaId);
		}
		return new Error('Not authorized');
	}
}
