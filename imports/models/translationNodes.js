import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Translation nodes (formerly Translations) are like textNodes but represent
 * translations of text nodes by commentators
 * @type {Meteor.Collection}
 */
const TranslationNodes = new Meteor.Collection('translationNodes');

/**
 * Translation Nodes schema
 * @type {SimpleSchema}
 */
TranslationNodes.schema = new SimpleSchema({
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
	n: {
		type: Number,
		optional: true
	},
	section: {
		type: Number,
		optional: true
	},
	text: {
		type: String,
		optional: true
	}
});

TranslationNodes.attachSchema(TranslationNodes.schema);

TranslationNodes.attachBehaviour('timestampable', {
	createdAt: 'created',
	updatedAt: 'updated',
});

export default TranslationNodes;
