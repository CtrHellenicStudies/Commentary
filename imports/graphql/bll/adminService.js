import { Accounts } from 'meteor/accounts-base';

/**
 * Admin service to use in other permissions logic layer functions to determine
 * if a user is an admin and able to edit content
 */

class AdminService {
	constructor({ token }) {
		this.token = token ? token : '';
		this.user = Meteor.users.findOne({
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(this.token),
		});
		this.userIsAdmin = this.user ? this.user.roles.indexOf('admin') !== -1 : false;
	}
}

export default AdminService;
