import Metafields from '/imports/collections/metafields';

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
