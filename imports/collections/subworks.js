const Subworks = new Meteor.Collection('subworks');

Subworks.schema = new SimpleSchema({
	title: {
		type: String,
		max: 60,
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

	n: {
		type: Number,
		min: 0,
	},

	nComments: {
		type: Number,
		optional: true,
		min: 0,
	},

	/*
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
	*/
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
