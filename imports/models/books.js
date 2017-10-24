import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Books represent books on the CHS main website (https://chs.harvard.edu) and
 * contain an array of chapters that have titles and URLs
 * @type {Meteor.Collection}
 */
const Books = new Meteor.Collection('books');

/**
 * Books schema 
 * @type {SimpleSchema}
 */
Books.schema = new SimpleSchema({
	title: {
		type: String
	},
	slug: {
		type: String,
		optional: true,
	},
	author: {
		type: String,
		optional: true,
	},
	authorURN: {
		type: String,
		optional: true,
	},
	chapters: {
		type: [Object],
		optional: true,
	},
	'chapters.$.url': {
		type: String,
		optional: true,
	},
	'chapters.$.title': {
		type: String,
		optional: true,
	},
	'chapters.$.n': {
		type: Number,
		optional: true,
	},
	'chapters.$.slug': {
		type: String,
		optional: true,
	},
	coverImage: {
		type: String,
		optional: true,
	},
	year: {
		type: Number,
		optional: true,
	},
	publisher: {
		type: String,
		optional: true,
	},
	citation: {
		type: String,
		optional: true,
	},
	tenantId: {
		type: String,
		optional: true,
	},
});

Books.attachSchema(Books.schema);
Books.attachBehaviour('timestampable');

export default Books;
