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
});
