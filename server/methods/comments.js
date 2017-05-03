import Comments from '/imports/api/collections/comments';

Meteor.methods({
	'comments.insert': (token, comment) => {
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
	},

	'comment.update': (token, commentId, update) => {
		check(token, Match.Maybe(String));
		check(commentId, String);
		check(update, Object);

		if ((
				!Meteor.userId()
				&& !Roles.userIsInRole(Meteor.user(), roles)
			)
			&& !Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken((token || '')),
			})
		) {
			throw new Meteor.Error('comment-update', 'not-authorized');
		}

		try {
			Comments.update({ _id: commentId }, { $set: update });
		} catch (err) {
			throw new Meteor.Error('comment-update', err);
		}

		return commentId;
	},

	'comment.delete': (token, commentId) => {
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
	},

	'comments.add.revision': (commentId, revision) => {
		check(commentId, String);
		check(revision, Object);

		const comment = Comments.find({ _id: commentId }).fetch()[0];

		if (!Roles.userIsInRole(Meteor.user(), ['editor', 'admin', 'commenter'])) {
			throw new Meteor.Error(`User ${Meteor.user()._id} attempted to add revision but was in an unauthorized role`);
		}

		let allowedToEdit = false;
		Meteor.user().canEditCommenters.forEach(commenterId => {
			comment.commenters.forEach(commenter => {
				if (commenterId === commenter._id) {
					allowedToEdit = true;
				}
			});
		});

		if (!allowedToEdit) {
			throw new Meteor.Error(`User ${Meteor.user()._id} attempted to add revision but was unauthorized on the commenter`);
		}

		const revisionId = new Meteor.Collection.ObjectID();
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
	},

	'comment.remove.revision': (commentId, revision) => {
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
	},

	'comments.getSuggestions': (value) => {
		check(value, String);

		if (!value.length) return Comments.find({}, { limit: 5, sort: { created: -1 } }).fetch();
		return Comments.find({ $text: { $search: value } }, { limit: 5, sort: { created: -1 } }).fetch();
	},
});
