import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Metafields are listed in the linked data schemas to provide a flexible mapping
 * from mongo data to json-ld
 * @type {Meteor.Collection}
 */
const Metafields = new Meteor.Collection('metafields');

/**
 * Metafields schema
 * @type {SimpleSchema}
 */
Metafields.schema = new SimpleSchema({
	key: {
		type: String
	},
	value: {
		type: String
	},
});

Metafields.attachSchema(Metafields.schema);

export default Metafields;
