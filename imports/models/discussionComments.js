import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Discussion comments are used for public users to add their own comments on
 * the primary comments in the commentaries
 * @type {Meteor.Collection}
 */
const DiscussionComments = new Meteor.Collection('discussionComments');

/**
 * Discussion comments schema
 * @type {SimpleSchema}
 */
DiscussionComments.schema = new SimpleSchema({
	userId: {
		type: String,
		optional: true,
	},
	content: {
		type: String,
		optional: true,
	},
	parentId: {
		type: String,
		optional: true,
	},
	commentId: {
		type: String,
		optional: true,
	},
	status: {
		type: String,
		optional: true,
	},
	votes: {
		type: Number,
		optional: true,
	},
	voters: {
		type: [String],
		optional: true,
	},
	reported: {
		type: Number,
		optional: true,
	},
	usersReported: {
		type: [String],
		optional: true,
	},
	tenantId: {
		type: String,
		optional: true,
	},
});

DiscussionComments.attachSchema(DiscussionComments.schema);

DiscussionComments.attachBehaviour('timestampable', {
	createdAt: 'created',
	createdBy: 'createdBy',
	updatedAt: 'updated',
	updatedBy: 'updatedBy'
});

export default DiscussionComments;
