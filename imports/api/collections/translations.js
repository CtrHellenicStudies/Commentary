import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Translations = new Meteor.Collection('translations');

Translations.schema = new SimpleSchema({
	originalDate: {
		type: Date,
		optional: true,
	},

	status: {
		type: String,
		optional: true,
	},

	wordpressId: {
		type: Number,
		optional: true,
	},

	tenantId: {
		type: String,
		optional: true,
	},

	commenters: {
		type: [Object],
		optional: true,
	},

	'commenters.$._id': {
		type: String,
		optional: true,
	},

	'commenters.$.name': {
		type: String,
		optional: true,
	},

	'commenters.$.slug': {
		type: String,
		optional: true,
	},

	'commenters.$.wordpressId': {
		type: Number,
		optional: true,
	},

	users: {
		type: [String],
		optional: true,
	},

	work: {
		type: Object,
		optional: true,
	},

	'work.title': {
		type: String,
		optional: true,
	},

	'work.slug': {
		type: String,
		optional: true,
	},

	'work.order': {
		type: Number,
		optional: true,
	},

	subwork: {
		type: Object,
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

	'subwork.n': {
		type: Number,
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

	bookChapterUrl: {
		type: String,
		optional: true,
	},

	paragraphN: {
		type: Number,
		optional: true,
	},

	nLines: {
		type: Number,
		optional: true,
	},


	isAnnotation: {
		type: Boolean,
		optional: true,
	},

	discussionCommentsDisabled: {
		type: Boolean,
		optional: true,
	},

	created: {
		type: Date,
		optional: true,
	},

	updated: {
		type: Date,
		optional: true,
	},
});

Translations.attachSchema(Translations.schema);

Translations.attachBehaviour('timestamable', {
	createdAt: 'created',
	createdBy: 'createdBy',
	updatedAt: 'updated',
	updatedBy: 'updatedBy'
});

export default Translations;
