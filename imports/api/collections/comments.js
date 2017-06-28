import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Comments = new Meteor.Collection('comments');

Comments.schema = new SimpleSchema({
	urn: {
		type: String,
		optional: true,
	},

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
	},

	'commenters.$._id': {
		type: String,
		optional: true,
	},

	'commenters.$.name': {
		type: String,
		optional: true,
	},

	'commenters.$.slug': {
		type: String,
		optional: true,
	},

	'commenters.$.wordpressId': {
		type: Number,
		optional: true,
	},

	users: {
		type: [String],
		optional: true,
	},

	work: {
		type: Object,
		optional: true,

	},

	'work.title': {
		type: String,
		optional: true,
	},

	'work.slug': {
		type: String,
		optional: true,
	},

	'work.order': {
		type: Number,
		optional: true,
	},

	subwork: {
		type: Object,
		optional: true,
	},

	'subwork.title': {
		type: String,
		optional: true,
	},

	'subwork.slug': {
		type: String,
		optional: true,
	},

	'subwork.n': {
		type: Number,
		optional: true,
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

	referenceWorks: {
		type: [Object],
		optional: true,
	},

	'referenceWorks.$.referenceWorkId': {
		type: String,
		optional: true,
	},

	'referenceWorks.$.section': {
		type: Number,
		optional: true,
	},

	'referenceWorks.$.chapter': {
		type: Number,
		optional: true,
	},

	'referenceWorks.$.translation': {
		type: Number,
		optional: true,
	},

	'referenceWorks.$.note': {
		type: Number,
		optional: true,
	},

	keywords: {
		type: [Object],
		optional: true,
	},

	'keywords.$._id': {
		type: String,
		optional: true,
	},

	'keywords.$.wordpressId': {
		type: Number,
		optional: true,
	},

	'keywords.$.title': {
		type: String,
		optional: true,
	},

	'keywords.$.slug': {
		type: String,
		optional: true,
	},

	'keywords.$.description': {
		type: String,
		optional: true,
	},

	'keywords.$.descriptionRaw': {
		type: Object,
		optional: true,
	},

	'keywords.$.type': {
		type: String,
		optional: true,
	},

	'keywords.$.count': {
		type: Number,
		optional: true,
	},

	'keywords.$.work': {
		type: Object,
		optional: true,
	},

	'keywords.$.lineFrom': {
		type: Number,
		optional: true,
	},

	'keywords.$.lineTo': {
		type: Number,
		optional: true,
	},

	'keywords.$.lineLetters': {
		type: String,
		optional: true,
	},

	'keywords.$.nLines': {
		type: Number,
		optional: true,
	},

	'keywords.$.tenantId': {
		type: String,
		optional: true,
	},

	'keywords.$.isMentionedInLemma': {
		type: Boolean,
		optional: true,
	},

	revisions: {
		type: [Object],
		optional: true,
	},

	'revisions.$._id': {
		type: String,
		optional: true,
	},

	'revisions.$.title': {
		type: String,
		optional: true,
	},

	'revisions.$.text': {
		type: String,
		optional: true,
	},

	'revisions.$.tenantId': {
		type: String,
		optional: true,
	},

	'revisions.$.originalDate': {
		type: Date,
		optional: true,
	},

	'revisions.$.friendlySlugs.slug.base': {
		type: String,
		optional: true,
	},

	'revisions.$.friendlySlugs.slug.index': {
		type: Number,
		optional: Number,
	},

	'revisions.$.slug': {
		type: String,
		optional: true,
	},

	'revisions.$.created': {
		type: Date,
		optional: true,
	},

	'revisions.$.createdBy': {
		type: String,
		optional: true,
	},

	'revisions.$.updated': {
		type: Date,
		optional: true,
	},

	'revisions.$.updatedBy': {
		type: String,
		optional: true,
	},

	discussionComments: {
		type: [Object],
		optional: true,
	},

	isAnnotation: {
		type: Boolean,
		optional: true,
	},

	discussionCommentsDisabled: {
		type: Boolean,
		optional: true,
	},

	created: {
		type: Date,
		optional: true,
	},

	updated: {
		type: Date,
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

const COMMENT_ID_LENGTH = 4;

function getURN(comment) {
	if (comment.commenters && comment.commenters.length) {
		return `${comment.work.slug}-${comment.subwork.title}-${comment.lineFrom}-${comment.commenters[0].slug}-${comment._id.slice(-COMMENT_ID_LENGTH)}`;
	} else {
		return `${comment.work.slug}-${comment.subwork.title}-${comment.lineFrom}-${comment._id.slice(-COMMENT_ID_LENGTH)}`;
	}
}

// hooks:
Comments.before.insert((userId, doc) => {
	doc.urn = getURN(doc);
});

Comments.before.update((userId, doc, fieldNames, modifier, options) => {
	modifier.$set.urn = getURN(doc);
});

export default Comments;
export { getURN };
