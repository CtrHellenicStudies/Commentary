import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';
import { ObjectID } from 'bson';

import Comments from '/imports/models/comments';
import Commenters from '/imports/models/commenters';
import { getAuthorizedUser } from '../helpers';


/**
 * Comment methods - either replaced or to be replaced with the graphql api
 */

const commentsInsert = (token, comment) => {
	check(token, Match.Maybe(String));
	check(comment, Object);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	// add comment to db
	let commentId;
	try {
		commentId = Comments.insert(comment);
	} catch (err) {
		throw new Meteor.Error(err);
	}

	if (!comment.commenters || !comment.commenters.length) {
		return commentId;
	}

	// add notification
	const options = { multi: true };
	const commenterId = comment.commenters[0]._id;
	const userAvatar = Commenters.findOne({_id: commenterId}, {'avatar.src': 1});
	const avatar = userAvatar && userAvatar.avatar ? userAvatar.avatar.src : '/images/default_user.jpg';

	const query = {
		$or: [
			{
				$and:
				[
					{'subscriptions.bookmarks.work.slug': comment.work.slug},
					{'subscriptions.bookmarks.subwork.slug': comment.subwork.slug},
					{'subscriptions.bookmarks.lineFrom': {$gte: comment.lineFrom}},
					{'subscriptions.bookmarks.lineTo': {$lte: comment.lineTo}}
				]
			},
			{
				'subscriptions.commenters': { $elemMatch: {_id: commenterId} }
			}
		]
	};

	const notification = {
		message: `${comment.commenters[0].name} commented on ${comment.work.title} ${comment.subwork.title}, lines ${comment.lineFrom} - ${comment.lineTo}`,
		avatar: {src: avatar},
		created: new Date(),
		_id: new ObjectID().toString(),
		slug: commentId
	};

	const update = { $push: {'subscriptions.notifications': notification} };
	const subscribedUsers = Meteor.users.update(query, update, notification, options);

	// send notification email
	const emailListQuery = {
		$and: [
			{
				$or: [
					{
						$and:
						[
							{'subscriptions.bookmarks.work.slug': comment.work.slug},
							{'subscriptions.bookmarks.subwork.slug': comment.subwork.slug},
							{'subscriptions.bookmarks.lineFrom': {$gte: comment.lineFrom}},
							{'subscriptions.bookmarks.lineTo': {$lte: comment.lineTo}}
						]
					},
					{
						'subscriptions.commenters': { $elemMatch: {_id: commenterId} }
					}
				]
			},
			{
				batchNotification: 'immediately'
			},
			{
				emails: { $exists: true }
			}
		]
	};

	const emailList = Meteor.users.find(emailListQuery);

	emailList.forEach(user => {

		let username = 'Commentary User';
		if (user.profile.name) {
			username = user.profile.name;
		} else if (user.username) {
			username = user.username;
		}

		const from = 'no-reply@ahcip.chs.harvard.edu';
		const to = user.emails[0].address;
		const subject = 'New Notification';
		const text = `
		Dear ${username},

		${comment.commenters[0].name} has published a new comment on the ${comment.work.title}.

		Please review your notification at A Homer Commentary in Progress (http://ahcip.chs.harvard.edu).

		You can change how often you receive these emails in your account settings.
		`;

		// TODO: Send email with batching
		// Email.send({ from, to, subject, text });

	});

	return commentId;
};

const commentsUpdate = (token, commentId, update) => {
	check(token, Match.Maybe(String));
	check(commentId, String);
	check(update, Object);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);
	const comment = Comments.findOne({ _id: commentId });
	const commenters = Commenters.find().fetch();

	let allowedToEdit = false;
	user.canEditCommenters.forEach((commenterId) => {
		comment.commenters.forEach((commenter) => {
			commenters.forEach((_commenter) => {
				if (
						commenter.slug === _commenter.slug
					&& _commenter._id === commenterId
				) {
					allowedToEdit = true;
				}
			});
		});
	});

	if (!allowedToEdit) {
		throw new Meteor.Error('User is not authorized to edit comments for this commentator');
	}

	try {
		Comments.update({ _id: commentId }, { $set: update });
	} catch (err) {
		throw new Meteor.Error(`comment-update ${err}`);
	}

	// add notification
	const options = { multi: true };

	const commenterId = comment.commenters[0]._id;
	const userAvatar = Commenters.findOne({_id: commenterId}, {'avatar.src': 1});

	const avatar = userAvatar && userAvatar.avatar ? userAvatar.avatar.src : '/images/default_user.jpg';

	const query = {
		$or: [
			{
				$and:
				[
					{'subscriptions.bookmarks.work.slug': comment.work.slug},
					{'subscriptions.bookmarks.subwork.slug': comment.subwork.slug},
					{'subscriptions.bookmarks.lineFrom': {$gte: comment.lineFrom}},
					{'subscriptions.bookmarks.lineTo': {$lte: comment.lineTo}}
				]
			},
			{
				'subscriptions.commenters': { $elemMatch: {_id: commenterId} }
			}
		]
	};

	const lines = comment.lineTo !== comment.lineFrom ? `lines ${comment.lineFrom} - ${comment.lineTo}` : `${comment.lineTo}`;

	const notification = {
		message: `${comment.commenters[0].name} updated a comment on ${comment.work.title} ${comment.subwork.title}, ${lines}`,
		avatar: {src: avatar},
		created: new Date(),
		_id: new ObjectID().toString(),
		slug: commentId
	};

	const updateUser = { $push: {'subscriptions.notifications': notification} };

	const subscribedUsers = Meteor.users.update(query, updateUser, notification, options);

	// send notification email
	const emailListQuery = {
		$and: [
			{
				$or: [
					{
						$and:
						[
							{'subscriptions.bookmarks.work.slug': comment.work.slug},
							{'subscriptions.bookmarks.subwork.slug': comment.subwork.slug},
							{'subscriptions.bookmarks.lineFrom': {$gte: comment.lineFrom}},
							{'subscriptions.bookmarks.lineTo': {$lte: comment.lineTo}}
						]
					},
					{
						'subscriptions.commenters': { $elemMatch: {_id: commenterId} }
					}
				]
			},
			{
				batchNotification: 'immediately'
			},
			{
				emails: { $exists: true }
			}
		]
	};

	const emailList = Meteor.users.find(emailListQuery);

	emailList.forEach(subscribedUser => {

		let username = 'Commentary User';
		if (subscribedUser.profile.name) {
			username = subscribedUser.profile.name;
		} else if (subscribedUser.username) {
			username = subscribedUser.username;
		}

		const from = 'no-reply@ahcip.chs.harvard.edu';
		const to = user.emails[0].address;
		const subject = 'New Notification';
		const text = `
		Dear ${username},

		${comment.commenters[0].name} has updated a comment on the ${comment.work.title}.

		Please review your notification at A Homer Commentary in Progress (http://ahcip.chs.harvard.edu).

		You can change how often you receive these emails in your account settings.
		`;

		Email.send({ from, to, subject, text });

	});

	return commentId;
};

const commentsRemove = (token, commentId) => {
	check(token, Match.Maybe(String));
	check(commentId, String);

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	try {
		Comments.remove({ _id: commentId });
	} catch (err) {
		throw new Meteor.Error('comment-delete', err);
	}

	return commentId;
};

const commentsAddRevision = (token, commentId, revision) => {
	check(token, Match.Maybe(String));
	check(commentId, String);
	check(revision, Object);

	const comment = Comments.findOne({ _id: commentId });
	const commenters = Commenters.find().fetch();

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	let allowedToEdit = false;
	user.canEditCommenters.forEach((commenterId) => {
		comment.commenters.forEach((commenter) => {
			commenters.forEach((_commenter) => {
				if (
						commenter.slug === _commenter.slug
					&& _commenter._id === commenterId
				) {
					allowedToEdit = true;
				}
			});
		});
	});

	if (!allowedToEdit) {
		throw new Meteor.Error(`User ${user._id} attempted to add revision but was unauthorized on the commenter`);
	}

	const revisionId = Random.id();
	revision._id = revisionId;

	try {
		Comments.update({
			_id: commentId,
		}, {
			$push: {
				revisions: revision,
			},
		});
	} catch (err) {
		throw new Meteor.Error(`Error adding revision to comment: ${err}`);
	}
	return revisionId;
};

const commentsRemoveRevision = (token, commentId, revision) => {
	check(token, Match.Maybe(String));
	check(commentId, String);
	check(revision, Object);

	const roles = ['editor', 'admin'];
	const user = getAuthorizedUser(roles, token);

	try {
		Comments.update({
			_id: commentId,
		}, {
			$pull: {
				revisions: revision,
			},
		}, {
			getAutoValues: false,
		});
	} catch (err) {
		throw new Meteor.Error('comment-remove-revision', err);
	}
};

const commentsGetSuggestions = (value) => {
	check(value, String);

	if (!value.length) return Comments.find({}, { limit: 5, sort: { created: -1 } }).fetch();
	return Comments.find({ $text: { $search: value } }, { limit: 5, sort: { created: -1 } }).fetch();
};

const commentsToggleDiscussionComments = (token, _id) => {
	check(_id, String);
	check(token, Match.Maybe(String));

	const roles = ['editor', 'admin', 'commenter'];
	const user = getAuthorizedUser(roles, token);

	const comment = Comments.findOne({_id});

	let updater = !comment.discussionCommentsDisabled;
	if (typeof updater === 'undefined') updater = true;

	if (comment) {
		try {
			Comments.update({
				_id
			}, {
				$set: {
					discussionCommentsDisabled: updater,
				},
			});
		} catch (err) {
			throw new Meteor.Error(`comment-toggle-discussion-comment: ${err}`);
		}
	}
};


Meteor.methods({
	'comments.insert': commentsInsert,
	'comment.update': commentsUpdate,
	'comment.delete': commentsRemove,
	'comments.add.revision': commentsAddRevision,
	'comment.remove.revision': commentsRemoveRevision,
	'comments.getSuggestions': commentsGetSuggestions,
	'comments.toggleDiscussionComments': commentsToggleDiscussionComments,
});

export { commentsInsert, commentsUpdate, commentsRemove, commentsAddRevision, commentsRemoveRevision, commentsGetSuggestions, commentsToggleDiscussionComments };
