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

	subworkFrom: {
		type: Object,
		optional: true,
	},

	'subworkFrom.title': {
		type: String,
		optional: true,
	},

	'subworkFrom.slug': {
		type: String,
		optional: true,
	},

	'subworkFrom.n': {
		type: Number,
		optional: true,
	},

	subworkTo: {
		type: Object,
		optional: true,
	},

	'subworkTo.title': {
		type: String,
		optional: true,
	},

	'subworkTo.slug': {
		type: String,
		optional: true,
	},

	'subworkTo.n': {
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

	revisions: {
		type: [Object],
		optional: true,
	},

	'revisions.$._id': {
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
