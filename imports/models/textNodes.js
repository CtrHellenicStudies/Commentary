import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Editions from '/imports/models/editions';

/**
 * TextNodes are the source text of the commentary that the comments are created
 * about. Will be replaced with an external textserver in the future.
 * @type {Meteor.Collection}
 */
const TextNodes = new Meteor.Collection('textNodes');

/**
 * TextNodes schema
 * @type {SimpleSchema}
 */
TextNodes.schema = new SimpleSchema({
	tenantId: {
		type: String,
		optional: true,
	},
	text: {
		type: [Object],
	},
	'text.$.n': {
		type: Number,
	},
	'text.$.text': {
		type: String,
	},
	'text.$.html': {
		type: String,
	},
	'text.$.edition': {
		type: String,
	},
	work: {
		type: Object,
	},
	'work.slug': {
		type: String,
	},
	subwork: {
		type: Object,
	},
	'subwork.title': {
		type: String,
	},
	'subwork.n': {
		type: Number,
	},
	relatedPassages: {
		type: [Object],
	},
});

TextNodes.attachSchema(TextNodes.schema);

export default TextNodes;
