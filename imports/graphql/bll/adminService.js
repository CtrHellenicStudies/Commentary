import { Accounts } from 'meteor/accounts-base';

export default class AdminService {
	constructor(props) {
		this.token = props.token ? props.token : '';
		this.user = Meteor.users.findOne({
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(this.token),
		});
		this.userIsAdmin = this.user ? this.user.roles.indexOf('admin') !== -1 : false;
	}
}
