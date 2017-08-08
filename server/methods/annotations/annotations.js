import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import Books from '/imports/api/collections/books';
import Comments from '/imports/api/collections/comments';


const annotationsInsert = (token, comment) => {
	check(token, String);
	check(comment, {
		tenantId: String,
		isAnnotation: Boolean,
		users: [String],
		paragraphN: Number,
		bookChapterUrl: String,
		status: String,
		parentCommentId: Match.Maybe(String),
		revisions: [{
			tenantId: String,
			title: Match.Maybe(String),
			text: String,
			textRaw: Match.Maybe(Object),
		}],
	});

	comment.revisions[0].created = new Date();
	comment.revisions[0].updated = new Date();

	let user = Meteor.user();
	if (!user) {
		user = Meteor.users.findOne({
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		});
	}
	if (!user) {
		throw new Meteor.Error('annotation-insert222', 'not-logged-in');
	}

	const book = Books.findOne({ 'chapters.url': comment.bookChapterUrl });
	const authorizedBooks = user.canAnnotateBooks || [];

	if (!book || !~authorizedBooks.indexOf(book._id)) {
		throw new Meteor.Error('annotation-insert3333', 'not-authorized');
	}

	let commentId;

	try {
		commentId = Comments.insert(comment);
		console.log('Annotation created', commentId);
	} catch (err) {
		throw new Meteor.Error('annotation-insert', err);
	}

	return commentId;
};

const annotationsAddRevision = (token, commentId, revision) => {
	check(token, Match.Maybe(String));
	check(commentId, String);
	check(revision, {
		tenantId: String,
		title: Match.Maybe(String),
		text: String,
		textRaw: Match.Maybe(Object),
	});

	revision.created = new Date();
	revision.updated = new Date();

	let user = Meteor.user();
	if (!user) {
		user = Meteor.users.findOne({
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		});
	}
	if (!user) {
		throw new Meteor.Error('annotation-insert', 'not-logged-in');
	}

	// Ensure the user is approved to edit this comment
	const comment = Comments.findOne({ _id: commentId, users: user._id });
	if (!comment) {
		throw new Meteor.Error('annotation-insert', 'not-authorized');
	}
	try {
		Comments.update({ _id: commentId }, { $addToSet: {
			revisions: revision
		}});
	} catch (err) {
		throw new Meteor.Error('annotation-add-revision', err);
	}

	return commentId;
};

const annotationsDelete = (token, commentId) => {
	check(token, String);
	check(commentId, String);

	let user = Meteor.user();
	if (!user) {
		user = Meteor.users.findOne({
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		});
	}
	if (!user) {
		throw new Meteor.Error('annotation-insert', 'not-logged-in');
	}

	try {
		Comments.remove({ _id: commentId });
	} catch (err) {
		throw new Meteor.Error('annotation-delete', err);
	}

	return commentId;
};


Meteor.methods({
	'annotations.insert': annotationsInsert,

	'annotations.addRevision': annotationsAddRevision,

	'annotations.delete': annotationsDelete,

});

export { annotationsInsert, annotationsAddRevision, annotationsDelete };
