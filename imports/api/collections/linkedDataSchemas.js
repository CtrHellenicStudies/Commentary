import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Terms from '/imports/api/collections/terms';

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
