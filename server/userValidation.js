/**
 * Validate user login attempts and determine if account is suspended
 */

Meteor.startup(() => {
	Accounts.validateLoginAttempt((attempt) => {
		if (attempt.user && attempt.user.roles && attempt.user.roles.indexOf('suspended') > -1) {
			attempt.allowed = false;
			throw new Meteor.Error(403, 'User account is suspended!');
		}
		return true;
	});
});
