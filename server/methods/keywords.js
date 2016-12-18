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

	'keywords.update': function updateKeyword(keywordCandidate) {
		check(keywordCandidate, Object);
		const roles = ['developer', 'admin', 'commenter'];
		if (Roles.userIsInRole(Meteor.user(), roles)) {
			console.log('Method called: \'keywords.update\'');
			console.log('Update:', keywordCandidate);

			try {
				Keywords.update({ _id: keywordCandidate._id }, { $set: keywordCandidate });
				console.log('Keyword', keywordCandidate._id, 'update successful');
			} catch (err) {
				console.log(err);
			}
		} else {
			console.log('Permission denied on method comments.update, for user:', Meteor.userId());
		}

		return keywordCandidate._id;
	},

	'keywords.delete': function deleteKeyword(keywordId) {
		check(keywordId, String);
		const roles = ['developer', 'admin', 'commenter'];
		if (Roles.userIsInRole(Meteor.user(), roles)) {
			console.log('Method called: \'keywords.delete\'');
			console.log('Delete:', keywordId);

			try {
				Keywords.remove({ _id: keywordId });
				console.log('Keyword', keywordId, 'delete successful');
			} catch (err) {
				console.log(err);
			}
		} else {
			console.log('Permission denied on method comments.update, for user:', Meteor.userId());
		}

		return keywordId;
	},
});
