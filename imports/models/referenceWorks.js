import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Reference works are the books, articles, and websites that the comments in
 * the commentary are drawn from
 * @type {Meteor.Collection}
 */
const ReferenceWorks = new Meteor.Collection('referenceWorks');

/**
 * Reference works schema
 * @type {SimpleSchema}
 */
ReferenceWorks.schema = new SimpleSchema({
	title: {
		type: String,
		optional: true,
	},

	slug: {
		type: String,
		max: 200,
		optional: true,
	},

	tenantId: {
		type: String,
		optional: true,
	},

	link: {
		type: String,
		optional: true,
	},

	authors: {
		type: [String],
		optional: true,
	},

	coverImage: {
		type: String,
		optional: true,
	},

	date: {
		type: Date,
		optional: true,
	},

	urnCode: {
		type: String,
		optional: true,
	},

	description: {
		type: String,
		optional: true,
	},

	citation: {
		type: String,
		optional: true,
	},
});

ReferenceWorks.attachSchema(ReferenceWorks.schema);
ReferenceWorks.friendlySlugs('title');

ReferenceWorks.attachBehaviour('timestampable', {
	createdAt: 'created',
	createdBy: 'createdBy',
	updatedAt: 'updated',
	updatedBy: 'updatedBy'
});

export default ReferenceWorks;
