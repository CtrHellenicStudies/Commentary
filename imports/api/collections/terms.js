import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Metafields from '/imports/api/collections/metafields';

const Terms = new Meteor.Collection('terms');

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
