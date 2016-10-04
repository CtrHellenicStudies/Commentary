Meteor.method("commentsCommenterFix", function() {

    var comments = Comments.find().fetch();
    comments.forEach((comment) => {
        comment.commenters.forEach((commenter, i) => {
            // if any of the comments commenters don't have a slug:
            if (!commenter.slug) {
                var commenterSlug = Commenters.find({name: commenter.name}).fetch()[0].slug;
                try {
                    Comments.update({'_id': comment._id, 'commenters.name': commenter.name}, {$set: {'commenters.$.slug': commenterSlug}});
                    console.log('commenterSlug:', commenterSlug, 'added to comment id:', comment._id);
                } catch(err) {
                    console.log(err);
                };
            };

            // if any of the comments commenters don't have a an id:
            if (!commenter._id) {
                var commenterId = Commenters.find({name: commenter.name}).fetch()[0]._id;
                try {
                    Comments.update({'_id': comment._id, 'commenters.name': commenter.name}, {$set: {'commenters.$._id': commenterId}});
                    console.log('commenterId:', commenterId, 'added to comment id:', comment._id);
                } catch(err) {
                    console.log(err);
                };
            };
        });
    });
    console.log(" -- method commentsCommenterFix run completed")

    return 1;

}, {
    url: "comments/commenter/fix",
});