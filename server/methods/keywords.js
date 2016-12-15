Meteor.methods({
	'keywords.insert': function insertKeywords(keywords) {
		check(keywords, [Object]);
		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}
		const keywordsIds = [];
		console.log('keywords insert called');
		console.log('keywords:', keywords);
		keywords.forEach((keyword) => {
			try {
				const keywordId = Keywords.insert(keyword);
				console.log('Keyword', keywordId, 'insert successful');
				keywordsIds.push(keywordId);
			} catch (err) {
				console.log(err);
			}
		});

		return keywordsIds;
	},

	'keywords.update': function updateComment(commentId, update) {
		check(commentId, String);
		check(update, Object);
		const roles = ['developer', 'admin', 'commenter'];
		if (Roles.userIsInRole(Meteor.user(), roles)) {
			console.log('Method called: \'comment.update\'');
			console.log('commentId:', commentId);
			console.log('Update:', update);

			try {
				Comments.update({ _id: commentId }, { $set: update });
				console.log('Comment', commentId, 'update successful');
			} catch (err) {
				console.log(err);
			}
		} else {
			console.log('Permission denied on method comments.update, for user:', Meteor.userId());
		}

		return commentId;
	},
});
