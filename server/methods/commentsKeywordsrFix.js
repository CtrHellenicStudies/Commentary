Meteor.method("commentsKeywordsFix", function() {

    var comments = Comments.find().fetch();
    comments.forEach((comment) => {
        if (comment.keywords.length > 0) {
            comment.keywords.forEach((keyword, i) => {
                // if any of the comments commenters don't have a slug:
                if (!keyword._id && keyword.slug) {
                    var keywordsId = Keywords.find({slug: keyword.slug}).fetch()[0]._id;
                    try {
                        Comments.update({'_id': comment._id, 'keywords.slug': keyword.slug}, {$set: {'keywords.$._id': keywordsId}});
                        console.log('keywordsId:', keywordsId, 'added to comment id:', comment._id);
                    } catch(err) {
                        console.log(err);
                    };
                };
            });
        };
    });
    console.log(" -- method commentsKeywordsFix run completed")

    return 1;

}, {
    url: "comments/keywords/fix",
});