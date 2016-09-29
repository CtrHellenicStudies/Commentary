Meteor.method("commentsCommenterSlugFix", function() {

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
        });
    });
    console.log(" -- method commentsCommenterSlugFix run completed")

    return 1;

}, {
    url: "comments/commenter/slug-fix",
});