Meteor.methods({
    'comments.insert' (comment) {
        console.log('comment insert called');
        console.log('comment:', comment);

        try {

        } catch (err) {
            console.log(err);
        }
    },
});
