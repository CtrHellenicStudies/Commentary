export default class AdminService {
	constructor(props) {
		this.token = props.token;
		this.user = Meteor.users.findOne({
			'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(props.token),
		});
		this.userIsAdmin = this.user.roles.indexOf('admin') !== -1;
	}
}