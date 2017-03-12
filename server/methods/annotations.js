import Books from '/imports/collections/books';
import Comments from '/imports/collections/comments';

Meteor.methods({
	'annotations.insert': (token, comment) => {
		check(token, String);
		check(comment, {
			tenantId: String,
			isAnnotation: Boolean,
			users: [String],
			paragraphN: Number,
			bookChapterUrl: String,
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
			throw new Meteor.Error('annotation-insert', 'not-logged-in');
		}

		const book = Books.findOne({ 'chapters.url': comment.bookChapterUrl });
		const authorizedBooks = user.canAnnotateBooks || [];

		if (!book || !~authorizedBooks.indexOf(book._id)) {
			throw new Meteor.Error('annotation-insert', 'not-authorized');
		}

		let commentId;
		console.log(book, comment);
		try {
			commentId = Comments.insert(comment);
			console.log('Annotation created', commentId);
		} catch (err) {
			throw new Meteor.Error('annotation-insert', err);
		}

		return commentId;
	},

	'annotations.addRevision': (token, commentId, revision) => {
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

		try {
			Comments.update({ _id: commentId }, { $set: update });
		} catch (err) {
			throw new Meteor.Error('annotation-add-revision', err);
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
