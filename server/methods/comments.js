import Comments from '/imports/collections/comments';

Meteor.methods({
	'comments.insert': (token, comment) => {
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
			throw new Meteor.Error('comment-insert', 'not-authorized');
		}

		let commentId;
		console.log(comment);

		try {
			commentId = Comments.insert(comment);
			console.log(commentId);
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
		let allow = false;
		// var roles = ['developer', 'admin'];
		comment.commenters.forEach((commenter) => {
			// roles.push(commenter.slug);
			allow = (Meteor.user().commenterId === commenter._id);
		});

		if (Roles.userIsInRole(Meteor.user(), ['developer', 'admin'])) {
			allow = true;
		}

		if (allow) {
			console.log('Method called: \'comment.add.revision\'');
			console.log('Updated comment\'s id:', commentId);
			console.log('Revision:', revision);

			try {
				Comments.update({
					_id: commentId,
				}, {
					$push: {
						revisions: revision,
					},
				});
				console.log('Comment', commentId, 'add revision successful');
			} catch (err) {
				console.log(err);
			}
		} else {
			console.log('Permission denied on method comments.add.revision, for user:', Meteor.userId());
		}
	},

	'comment.remove.revision': (commentId, revision) => {
		check(commentId, String);
		check(revision, Object);
		const roles = ['developer'];
		if (Roles.userIsInRole(Meteor.user(), roles)) {
			console.log('Method called: \'comment.remove.revision\'');
			console.log('commentId:', commentId);
			console.log('revision:', revision);

			try {
				// Workaround for meteor $pull problem
				// var comment = Comments.find({_id: commentId}).fetch()[0];
				// console.log('comment', comment);
				// comment.revisions = _.reject(comment.revisions, (el) => {
				//     return el.created === revision.created;
				// });
				// console.log('comment', comment);
				Comments.update({
					_id: commentId,
				}, {
					$pull: {
						revisions: revision,
					},
				}, {
					getAutoValues: false,
				});
				console.log('Revision', revision, 'remove successful');
			} catch (err) {
				console.log(err);
			}
		} else {
			console.log('Permission denied on method comment.remove.revision, for user:',
				Meteor.userId());
		}
	},

	'comments.getSuggestions': (value) => {
		check(value, String);

		if (!value.length) return Comments.find({}, { limit: 5, sort: { created: -1 } }).fetch();
		return Comments.find({ $text: { $search: value } }, { limit: 5, sort: { created: -1 } }).fetch();
	},
});
