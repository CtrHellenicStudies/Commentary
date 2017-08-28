import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Metafields = new Meteor.Collection('metafields');

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
