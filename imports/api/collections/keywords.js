import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Keywords = new Meteor.Collection('keywords');

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
		blackbox: true,

	},

	subwork: {
		type: Object,
		blackbox: true,

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
