import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import _ from 'underscore';

import Works from './works';
import Books from './books';
import Tenants from './tenants';

/**
 * Comments are the primary data type of the commentaries. They represent
 * thoughts from commentators on the source text (such as a comment on a specific
 * line of Homer). They are also used for annotations on the CHS websites
 * @type {Meteor.Collection}
 */
const Comments = new Meteor.Collection('comments');

/**
 * Comments schema
 * @type {SimpleSchema}
 */
Comments.schema = new SimpleSchema({
	urn: {
		type: Object,
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

	section: {
		type: Object,
		optional: true,
	},

	'section.n': {
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

	'revisions.$.textRaw': {
		type: Object,
		optional: true,
		blackbox: true,
	},

	'revisions.$.originalDate': {
		type: Date,
		optional: true,
	},

	'revisions.$.created': {
		type: Date,
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

const COMMENT_ID_LENGTH = 7;

const _getCommentURN = (comment) => {
	const work = Works.findOne({ slug: comment.work.slug }),
	tenant = Tenants.findOne({_id: comment.tenantId}),
	urnPrefixV1 = 'urn:cts:CHS.Commentary',
	urnPrefixV2 = 'urn:cts:CHS:Commentaries.' + tenant.subdomain.toUpperCase();
	// Use work tlg if it exists, otherwise, search for subwork tlg number
	// Failing either, just use creator
	let urnTLG = work.tlgCreator;
	if (work.tlg && work.tlg.length) {
		urnTLG += `.${work.tlg}`;
	} else {
		work.subworks.forEach((subwork) => {
			if (
					subwork.n === comment.subwork.n
				&& subwork.tlgNumber
				&& subwork.tlgNumber.length
			) {
				urnTLG += `.${subwork.tlgNumber}`;
			}
		});
	}

	//
	urnTLG += '.chsCommentary';
	const workTitle = comment.work.title.replace(' ', '');

	let urnComment = `${workTitle}.${comment.subwork.title}.${comment.lineFrom}`;

	if (typeof comment.lineTo !== 'undefined' && comment.lineFrom !== comment.lineTo) {
		urnComment += `-${comment.subwork.title}.${comment.lineTo}`;
	}

	const urnCommentId = `${comment._id.slice(-COMMENT_ID_LENGTH)}`;
	return {
		 'v1': `${urnPrefixV1}:${urnComment}.${urnCommentId}`,
		 'v2': `${urnPrefixV2}:${urnComment}.${urnCommentId}`};
};

const _getAnnotationURN = (comment) => {
	const book = Books.findOne({ 'chapters.url': comment.bookChapterUrl }),
	chapter = _.find(book.chapters, c => c.url === comment.bookChapterUrl),
	tenant = Tenants.findOne({_id: comment.tenantId}),
	urnPrefixV1 = 'urn:cts:CHS.Annotations',
	urnPrefixV2 = 'urn:cts:CHS:Annotations.' + tenant.subdomain.toUpperCase(),
	urnBook = `${book.authorURN}.${book.slug}`,
	urnComment = `${chapter.n}.${comment.paragraphN}`,
	urnCommentId = `${comment._id.slice(-COMMENT_ID_LENGTH)}`;

	return {
		'v1': `${urnPrefixV1}:${urnComment}.${urnCommentId}`,
	 	'v2': `${urnPrefixV2}:${urnComment}.${urnCommentId}`};
};

function getURN(comment) {
	if (comment.isAnnotation) {
		return _getAnnotationURN(comment);
	}

	return _getCommentURN(comment);
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
