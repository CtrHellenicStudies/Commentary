import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * TODO: rename all references to keywords/ideas as Tags
 * Keywords (tags on the frontend) are associated with comments and used for
 * organizing the comments around themes
 * @type {Meteor.Collection}
 */
const Keywords = new Meteor.Collection('keywords');

/**
 * Keywords schema
 * @type {SimpleSchema}
 */
Keywords.schema = new SimpleSchema({
	_id: {
		type: String,
		optional: true,
	},

	wordpressId: {
		type: Number,
		optional: true,
	},

	title: {
		type: String,
	},

	slug: {
		type: String,
		max: 200,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false,
		},
	},

	description: {
		type: String,
		optional: true,
	},

	descriptionRaw: {
		type: Object,
		optional: true,
	},

	type: {
		type: String,
		optional: true,
		defaultValue: 'word',
	},

	count: {
		type: Number,
		optional: true,
	},

	work: {
		type: Object,
		optional: true,
	},

	'work._id': {
		type: String,
		optional: true,
	},

	'work.title': {
		type: String,
		optional: true,
	},

	'work.order': {
		type: Number,
		optional: true,
	},

	'work.subworks': {
		type: [Object],
		optional: true,
	},

	'work.friendlySlugs': {
		type: Object,
		optional: true,
	},

	'work.slug': {
		type: String,
		optional: true,
	},

	'work.updated': {
		type: Date,
		optional: true,
	},

	'work.tenantID': {
		type: String,
		optional: true,
	},

	subwork: {
		type: Object,
		optional: true,
	},

	'subwork.n': {
		type: Number,
		optional: true,
	},

	'subwork.title': {
		type: String,
		optional: true,
	},

	'subwork.slug': {
		type: String,
		optional: true,
	},

	'subwork.comments': {
		type: [Object],
		optional: true,
	},

	lineFrom: {
		type: Number,
		optional: true,
	},

	lineTo: {
		type: Number,
		optional: true,
	},

	lineLetter: {
		type: String,
		optional: true,
	},

	nLines: {
		type: Number,
		optional: true,
	},
	tenantId: {
		type: String,
		optional: true,
	},
});

Keywords.attachSchema(Keywords.schema);
Keywords.friendlySlugs('title');

Keywords.attachBehaviour('timestampable', {
	createdAt: 'created',
	createdBy: 'createdBy',
	updatedAt: 'updated',
	updatedBy: 'updatedBy'
});

export default Keywords;
