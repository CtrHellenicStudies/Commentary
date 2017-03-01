import Metafields from '/imports/collections/metafields';

const Terms = new Meteor.Collection('terms');

Terms.schema = new SimpleSchema({
  term: {
    type: String,
  },
	resourceIdentifier: {
		type: String,
		label: "Resource Identifier (IRI: see http://json-ld.org/spec/latest/json-ld/#iris)",
		optional: true,
	},
	metaFields: {
		type: [Metafields],
		label: "Metafields to describe the term resource (such as @id or @type: see http://json-ld.org/spec/latest/json-ld/#specifying-the-type)",
		optional: true,
	},
});

Terms.attachSchema(Terms.schema);

export default Terms;
