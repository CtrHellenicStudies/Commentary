import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Subworks from '/imports/models/subworks';

const Works = new Meteor.Collection('works');

Works.schema = new SimpleSchema({
	title: {
		type: String,
	},
	tenantId: {
		type: String,
		optional: true,
	},
	tlgCreator: {
		type: String,
		optional: true,
	},
	tlg: {
		type: String,
		optional: true,
	},
	slug: {
		type: String,
		optional: true,
	},
	order: {
		type: Number,
		optional: true,
	},
	nComments: {
		type: Number,
		optional: true,
		min: 0,
	},
	subworks: {
		type: [Subworks.schema],
		optional: true,
	},
});

Works.attachSchema(Works.schema);
Works.friendlySlugs('title');

Works.attachBehaviour('timestampable', {
	createdAt: 'created',
	createdBy: 'createdBy',
	updatedAt: 'updated',
	updatedBy: 'updatedBy'
});

export default Works;
