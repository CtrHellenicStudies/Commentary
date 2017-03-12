import Comments from '/imports/collections/comments';

Meteor.methods({
	'annotations.insert': (token, comment) => {
		check(token, String);
		check(comment, Object);
		const roles = ['developer', 'admin', 'commenter'];
		if ((
				!Meteor.userId()
				&& !Roles.userIsInRole(Meteor.user(), roles)
			)
			&& !Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})
		) {
			throw new Meteor.Error('annotation-insert', 'not-authorized');
		}

		let commentId;
		try {
			commentId = Comments.insert(comment);
		} catch (err) {
			throw new Meteor.Error('annotation-insert', err);
		}

		return commentId;
	},

	'annotations.update': (token, commentId, update) => {
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
			throw new Meteor.Error('annotation-update', 'not-authorized');
		}

		try {
			Comments.update({ _id: commentId }, { $set: update });
		} catch (err) {
			throw new Meteor.Error('annotation-update', err);
		}

		return commentId;
	},

	'annotations.delete': (token, commentId) => {
		check(token, String);
		check(commentId, String);

		const roles = ['developer', 'admin', 'commenter'];
		if ((
				!Meteor.userId()
				&& !Roles.userIsInRole(Meteor.user(), roles)
			)
			&& !Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})
		) {
			throw new Meteor.Error('annotation-delete', 'not-authorized');
		}

		try {
			Comments.remove({ _id: commentId });
		} catch (err) {
			throw new Meteor.Error('annotation-delete', err);
		}

		return commentId;
	},

});
