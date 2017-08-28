import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Translations = new Meteor.Collection('translations');

Translations.schema = new SimpleSchema({
	tenantId: {
		type: String,
		optional: true
	},
	created: {
		type: Date,
		optional: true
	},
	updated: {
		type: Date,
		optional: true
	},
	author: {
		type: String,
		optional: true
	},
	work: {
		type: String,
		optional: true
	},
	subwork: {
		type: Number,
		optional: true
	},
	lineFrom: {
		type: Number,
		optional: true
	},
	lineTo: {
		type: Number,
		optional: true
	},
	nLines: {
		type: Number,
		optional: true
	},
	revisions: {
		type: [Object],
		optional: true,
		blackbox: true
	},
	'revisions.$.tenantId': {
		type: String,
		optional: true
	},
	'revisions.$.created': {
		type: Date,
		optional: true,
	},
	'revisions.$.slug': {
		type: String,
		optional: true
	},
});

Translations.attachSchema(Translations.schema);

Translations.attachBehaviour('timestampable', {
	createdAt: 'created',
	updatedAt: 'updated',
});

export default Translations;
