import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Translations = new Meteor.Collection('translations');

Translations.schema = new SimpleSchema({
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

	work: {
		type: Object,
		optional: true,
	},

	subwork: {
		type: Object,
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

	textValue: {
		type: Object,
		optional: true
	},

	textRawValue: {
		type: Object,
		optional: true
	},

	revisions: {
		type: [Object],
		optional: true,
	},

	'revisions.$._id': {
		type: String,
		optional: true,
	},

	'revisions.$.title': {
		type: String,
		optional: true,
	},

	'revisions.text': {
		type: String,
		optional: true,
	},

	'revisions.$.tenantId': {
		type: String,
		optional: true,
	},

	'revisions.$.originalDate': {
		type: Date,
		optional: true,
	},

	'revisions.friendlySlugs.slug.base': {
		type: String,
		optional: true,
	},

	'revisions.friendlySlugs.slug.index': {
		type: Number,
		optional: Number,
	},

	'revisions.$.slug': {
		type: String,
		optional: true,
	},

	'revisions.$.created': {
		type: Date,
		optional: true,
	},

	'revisions.$.createdBy': {
		type: String,
		optional: true,
	},

	'revisions.$.updated': {
		type: Date,
		optional: true,
	},

	'revisions.$.updatedBy': {
		type: String,
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
