import LinkedDataSchema from '/imports/models/linkedDataSchemas';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with linked data schemata
 */
export default class LinkedDataSchemaService extends AdminService {

	/**
	 * Get linked data schemata
	 * @param {string} id - id of linked data schema
	 * @returns {Object[]} array of linked data schemata
	 */
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

	/**
	 * Remove a linked data schema
	 * @param {string} id - id of linked data schema to remove
	 * @returns {boolean} result of mongo orm remove
	 */
	linkedDataSchemaRemove(id) {
		if (this.userIsAdmin) {
			return LinkedDataSchema.remove({_id: id});
		}
		return new Error('Not authorized');
	}

	/**
	 * Update a linked data schema
	 * @param {string} linkedDataSchemaId - id of the linked data schema to update
	 * @param {Object} linkedDataSchema - params of schema to update
	 * @returns {Object} updated linked data schema reports
	 */
	linkedDataSchemaUpdate(linkedDataSchemaId, linkedDataSchema) {
		if (this.userIsAdmin) {
			LinkedDataSchema.update(linkedDataSchemaId, {$set: linkedDataSchema});
			return LinkedDataSchema.findOne(linkedDataSchemaId);
		}
		return new Error('Not authorized');
	}

	/**
	 * Create a new linked data schema
	 * @param {Object} linkedDataSchema - linked data schema candidate record
	 * @returns new linked data schema record
	 */
	linkedDataSchemaCreate(linkedDataSchema) {
		if (this.userIsAdmin) {
			const linkedDataSchemaId = LinkedDataSchema.insert({...linkedDataSchema});
			return LinkedDataSchema.findOne(linkedDataSchemaId);
		}
		return new Error('Not authorized');
	}
}
