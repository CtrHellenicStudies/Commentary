Meteor.startup(() => {
    Accounts.validateLoginAttempt(function(attempt) {
        if (attempt.user && attempt.user.roles && attempt.user.roles.indexOf('suspended') > -1) {
            attempt.allowed = false;
            throw new Meteor.Error(403, "User account is suspended!");
        }
        return true;
    });
});