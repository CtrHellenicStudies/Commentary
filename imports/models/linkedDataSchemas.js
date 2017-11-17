import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Terms from '/imports/models/terms';

/**
 * Linked data schemas are used on the backend to map the mongo data models to
 * json-ld compatable response in the graphql API
 * @type {Meteor.Collection}
 */
const LinkedDataSchemas = new Meteor.Collection('linked_data_schemas');

/**
 * Linked data schemas schema
 * @type {SimpleSchema}
 */
LinkedDataSchemas.schema = new SimpleSchema({
	collectionName: {
		type: String,
		optional: true,
	},
	terms: {
		type: [Terms.schema],
		optional: true,
	},
});

LinkedDataSchemas.attachSchema(LinkedDataSchemas.schema);
export default LinkedDataSchemas;
