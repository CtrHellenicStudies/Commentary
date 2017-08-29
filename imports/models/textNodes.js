import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import Editions from '/imports/models/editions';

const TextNodes = new Meteor.Collection('textNodes');

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
