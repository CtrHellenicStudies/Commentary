import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import _ from 'underscore';


/**
 * Get user by token or native Meteor user method
 * (Workaround until graphql Auth Service is completed)
 * @param  {string} token User auth token
 * @param  {Array} array of role names
 * @return {Object} User object
 */
export const getAuthorizedUser = (roles, token) => {
	let user;
	if (token) {
		user = Meteor.users.findOne({
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
		});
	} else {
		user = Meteor.user();
	}

	if (!user) {
		throw new Error('Could not find logged in user');
	}

	if (!(_.intersection(roles, user.roles).length)) {
		throw new Error(`User ${user._id} attempted action in an unauthorized role`);
	}

	return user;
};
