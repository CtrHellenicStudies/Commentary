import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Subworks = new Meteor.Collection('subworks');

Subworks.schema = new SimpleSchema({
	title: {
		type: String,
	},
	slug: {
		type: String,
		optional: true,
	},

	n: {
		type: Number,
	},

	tlgNumber: {
		type: String,
		optional: true,
	},

	nComments: {
		type: Number,
		optional: true,
	},

	commentHeatmap: {
		type: [Object],
		optional: true,
	},
	'commentHeatmap.$.n': {
		type: Number,
	},
	'commentHeatmap.$.nComments': {
		type: Number,
	},
});

Subworks.attachSchema(Subworks.schema);
Subworks.friendlySlugs('title');

Subworks.attachBehaviour('timestampable', {
	createdAt: 'created',
	createdBy: 'createdBy',
	updatedAt: 'updated',
	updatedBy: 'updatedBy'
});

export default Subworks;
