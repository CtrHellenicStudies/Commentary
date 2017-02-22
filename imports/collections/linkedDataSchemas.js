import Terms from '/imports/collections/terms';

const LinkedDataSchemas = new Meteor.Collection('linked_data_schemas');

LinkedDataSchemas.schema = new SimpleSchema({
  collectionName: {
    type: String,
		optional: true,
  },
	terms: {
		// type: [Terms],
		type: [Object],
		optional: true,
	},
	'terms.$.term' : {
    type: String,
		optional: true,
	},
	'terms.$.resourceIdentifier' : {
		type: String,
		label: "Resource Identifier (IRI: see http://json-ld.org/spec/latest/json-ld/#iris)",
		optional: true,
	},
	'terms.$.metafields' : {
		type: [Object],
		label: "Metafields to describe the term resource (such as @id or @type: see http://json-ld.org/spec/latest/json-ld/#specifying-the-type)",
		optional: true,
	},
	'terms.$.metafields.$.key' : {
    type: String,
		optional: true,
	},
	'terms.$.metafields.$.value' : {
    type: String,
		optional: true,
	},
});

LinkedDataSchemas.attachSchema(LinkedDataSchemas.schema);
export default LinkedDataSchemas;
