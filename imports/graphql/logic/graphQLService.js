import { Accounts } from 'meteor/accounts-base';

/**
 * Admin service to use in other permissions logic layer functions to determine
 * if a user is an admin and able to edit content
 */

class GraphQLService {
	constructor({ token }) {
		this.token = token || '';
		this.user = Meteor.users.findOne({
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(this.token),
		});
		this.userIsAdmin = this.user && this.user.roles ? this.user.roles.indexOf('admin') !== -1 : false;
		this.userIsEditor = this.user && this.user.roles ? this.user.roles.indexOf('editor') !== -1 : false;
		this.userIsCommenter = this.user && this.user.roles ? this.user.roles.indexOf('commenter') !== -1 : false;
		this.userIsNobody = !this.userIsAdmin && !this.userIsCommenter && !this.userIsEditor;
	}
}

export default GraphQLService;
