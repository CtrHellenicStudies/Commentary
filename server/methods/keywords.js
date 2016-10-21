Meteor.methods({
    'keywords.insert' (keywords) {

        // Make sure the user is logged in before inserting
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        var keywordsIds = [];
        console.log('keywords insert called');
        console.log('keywords:', keywords);
        keywords.forEach((keyword) => {
            try {
                var keywordId = Keywords.insert(keyword);
                console.log('Keyword', keywordId, 'insert successful');
                keywordsIds.push(keywordId);
            } catch (err) {
                console.log(err);
            }
        });

        return keywordsIds;
    },
});
