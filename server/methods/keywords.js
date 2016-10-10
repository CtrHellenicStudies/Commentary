Meteor.methods({
    'keywords.insert' (keywords) {

        // Make sure the user is logged in before inserting
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        console.log('keywords insert called');
        console.log('keywords:', keywords);

        try {
            // insert into keywords
        } catch (err) {
            console.log(err);
        }
    },
});
