import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Metafields from '/imports/models/metafields';

/**
 * Terms represent the joining link between metafields and linked data resource
 * identifiers for the linked data schemas
 * @type {Meteor.Collection}
 */
const Terms = new Meteor.Collection('terms');

/**
 * Terms schema
 * @type {SimpleSchema}
 */
Terms.schema = new SimpleSchema({
	term: {
		type: String,
	},
	resourceIdentifier: {
		type: String,
		optional: true,
	},
	metaFields: {
		type: [Metafields.schema],
		optional: true,
	},
});

Terms.attachSchema(Terms.schema);

export default Terms;
