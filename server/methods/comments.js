Meteor.methods({
    'comments.insert' (comment) {
        var roles = ['developer', 'admin', 'commenter'];
        if (Roles.userIsInRole(Meteor.user(), roles)) {
            console.log('Method called: \'comment.insert\'');
            console.log('Comment:', comment);

            try {
                // TODO: insert new comment
                commentId = Comments.insert(comment);
                console.log('Comment', commentId, 'insert successful');
            } catch (err) {
                console.log(err);
            };

        } else {
            console.log('Permission denied on method comments.insert, for user:', Meteor.userId());
        };

        return commentId;

    },

    'comments.add.revision' (commentId, revision) {

        var comment = Comments.find({_id: commentId}).fetch()[0];
        var allow = false;
        // var roles = ['developer', 'admin'];
        comment.commenters.forEach((commenter) => {
            // roles.push(commenter.slug);
            allow = (Meteor.user().commenterId === commenter._id);
        });

        if(Roles.userIsInRole(Meteor.user(), ['developer', 'admin'])) {
            allow = true;
        };

        if (allow) {
            console.log('Method called: \'comment.add.revision\'');
            console.log('Updated comment\'s id:', commentId);
            console.log('Revision:', revision);

            try {
                Comments.update({_id: commentId}, {$push: {revisions: revision}});
                console.log('Comment', commentId, 'add revision successful');
            } catch (err) {
                console.log(err);
            };

        } else {
            console.log('Permission denied on method comments.add.revision, for user:', Meteor.userId());
        };
    },

    'comment.remove.revision' (commentId, revision) {
        var roles = ['developer'];
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
                Comments.update({_id: commentId}, {$pull: {'revisions': revision}}, {getAutoValues: false});
                console.log('Revision', revision, 'remove successful');
            } catch (err) {
                console.log(err);
            };

        } else {
            console.log('Permission denied on method comment.remove.revision, for user:', Meteor.userId());
        };
    },

    'users' () {
        console.log(Meteor.user());
    },
});