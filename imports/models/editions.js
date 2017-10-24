import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Editions represent a version of a specific work, such the Oxford Classical
 * Texts edition of the Iliad
 * @type {Meteor.Collection}
 */
const Editions = new Meteor.Collection('editions');

/**
 * Editions schema
 * @type {SimpleSchema}
 */
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
