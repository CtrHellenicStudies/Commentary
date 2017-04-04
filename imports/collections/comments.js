import Tenants from '/imports/collections/tenants';


const Comments = new Meteor.Collection('comments');

Comments.schema = new SimpleSchema({
	originalDate: {
		type: Date,
		optional: true,
	},

	status: {
		type: String,
		optional: true,
	},

	wordpressId: {
		type: Number,
		optional: true,
	},

	tenantId: {
		type: String,
	},

	commenters: {
		type: [Object],
		optional: true,
		blackbox: true,
	},

	users: {
		type: [String],
		optional: true,
	},

	work: {
		type: Object,
		optional: true,
		blackbox: true,

	},

	subwork: {
		type: Object,
		optional: true,
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

	bookChapterUrl: {
		type: String,
		optional: true,
	},

	paragraphN: {
		type: Number,
		optional: true,
	},

	nLines: {
		type: Number,
		optional: true,
	},

	commentOrder: {
		type: Number,
		optional: true,
	},

	parentCommentId: {
		type: String,
		optional: true,
	},

	referenceId: {
		type: String,
		optional: true,
	},

	referenceSection: {
		type: Number,
		optional: true,
	},

	referenceChapter: {
		type: Number,
		optional: true,
	},

	referenceTranslation: {
		type: Number,
		optional: true,
	},

	referenceNote: {
		type: Number,
		optional: true,
	},

	keywords: {
		type: [Object],
		optional: true,
		blackbox: true,
	},

	revisions: {
		type: [Object],
		optional: true,
		blackbox: true,
	},

	discussionComments: {
		type: [Object],
		optional: true,
		blackbox: true,
	},

	isAnnotation: {
		type: Boolean,
		optional: true,
	},
});

Comments.attachSchema(Comments.schema);

Comments.attachBehaviour('timestampable', {
  createdAt: 'created',
  createdBy: 'createdBy',
  updatedAt: 'updated',
  updatedBy: 'updatedBy'
});

export default Comments;
