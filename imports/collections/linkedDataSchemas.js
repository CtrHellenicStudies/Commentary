import Terms from '/imports/collections/terms';
import MetaFields from '/imports/collections/metafields';

const LinkedDataSchemas = new Meteor.Collection('linked_data_schemas');

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
