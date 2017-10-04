import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Editions = new Meteor.Collection('editions');

Editions.schema = new SimpleSchema({
	title: {
		type: String
	},
	slug: {
		type: String
	},
	multiLine: {
		type: [String]
	},
});

Editions.attachSchema(Editions.schema);
export default Editions;
