import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import Comments from '/imports/api/collections/comments';
import Commenters from '/imports/api/collections/commenters';


const commentsInsert = (token, comment) => {
	check(token, String);
	check(comment, Object);
	const roles = ['editor', 'admin', 'commenter'];
	if ((
			!Meteor.userId()
			&& !Roles.userIsInRole(Meteor.user(), roles)
		)
		&& !Meteor.users.findOne({
			roles: roles,
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})
	) {
		throw new Meteor.Error('comment-insert', 'not-authorized');
	}

	let commentId;
	try {
		commentId = Comments.insert(comment);
	} catch (err) {
		throw new Meteor.Error('comment-insert', err);
	}

	return commentId;
}

const commentsUpdate = (token, commentId, update) => {
	check(token, Match.Maybe(String));
	check(commentId, String);
	check(update, Object);

	const user = Meteor.user() || Meteor.users.findOne({
		'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken((token || '')),
	});

	const comment = Comments.find({ _id: commentId }).fetch()[0];
	const commenters = Commenters.find().fetch();

	if (!Roles.userIsInRole(user, ['editor', 'admin', 'commenter'])) {
		throw new Meteor.Error(`User ${user._id} attempted to update comment but was in an unauthorized role`);
	}

	let allowedToEdit = false;
	user.canEditCommenters.forEach(commenterId => {
		comment.commenters.forEach(commenter => {
			commenters.forEach(_commenter => {
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
		throw new Meteor.Error(`User ${user._id} attempted to update comment but was unauthorized on the commenter`);
	}

	try {
		Comments.update({ _id: commentId }, { $set: update });
	} catch (err) {
		throw new Meteor.Error('comment-update', err);
	}

	return commentId;
}

const commentsRemove = (token, commentId) => {
	check(token, String);
	check(commentId, String);

	const roles = ['editor', 'admin', 'commenter'];
	if ((
			!Meteor.userId()
			&& !Roles.userIsInRole(Meteor.user(), roles)
		)
		&& !Meteor.users.findOne({
			roles: 'admin',
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})
	) {
		throw new Meteor.Error('comment-delete', 'not-authorized');
	}

	try {
		Comments.remove({ _id: commentId });
	} catch (err) {
		throw new Meteor.Error('comment-delete', err);
	}

	return commentId;
}

const commentsAddRevision = (commentId, revision) => {
	check(commentId, String);
	check(revision, Object);

	const comment = Comments.find({ _id: commentId }).fetch()[0];
	const commenters = Commenters.find().fetch();

	if (!Roles.userIsInRole(Meteor.user(), ['editor', 'admin', 'commenter'])) {
		throw new Meteor.Error(`User ${Meteor.user()._id} attempted to add revision but was in an unauthorized role`);
	}

	let allowedToEdit = false;
	Meteor.user().canEditCommenters.forEach(commenterId => {
		comment.commenters.forEach(commenter => {
			commenters.forEach(_commenter => {
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
		throw new Meteor.Error(`User ${Meteor.user()._id} attempted to add revision but was unauthorized on the commenter`);
	}

	const revisionId = new Meteor.Collection.ObjectID();
	revision._id = revisionId.valueOf();

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
}

const commentsRemoveRevision = (commentId, revision) => {
	check(commentId, String);
	check(revision, Object);
	const roles = ['editor', 'admin'];

	if (!Roles.userIsInRole(Meteor.user(), roles)) {
		throw new Meteor.Error(`Permission denied on method comment.remove.revision for user ${Meteor.userId()}`);
	}

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
		throw new Meteor.Error(`Error remove comment revision: ${err}`);
	}
}

const commentsGetSuggestions = (value) => {
	check(value, String);

	if (!value.length) return Comments.find({}, { limit: 5, sort: { created: -1 } }).fetch();
	return Comments.find({ $text: { $search: value } }, { limit: 5, sort: { created: -1 } }).fetch();
}

const commentsToggleDiscussionComments = (token, _id) => {
	check(_id, String);
	check(token, Match.Maybe(String));

	const roles = ['editor', 'admin', 'commenter'];
	if ((
			!Meteor.userId()
			&& !Roles.userIsInRole(Meteor.user(), roles)
		)
		&& !Meteor.users.findOne({
			roles: roles,
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		})
	) {
		throw new Meteor.Error('comment-insert', 'not-authorized');
	}

	const comment = Comments.findOne({_id});

	let updater = !comment.discussionCommentsDisabled;
	if (typeof updater === 'undefined') updater = true;

	if (comment) {
		Comments.update({
			_id
		}, {
			$set: {
				discussionCommentsDisabled: updater,
			},
		});
	}
}


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
