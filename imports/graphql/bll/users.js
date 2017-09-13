import {Meteor} from 'meteor/meteor';
import AdminService from './adminService';

export default class UserService extends AdminService {
	constructor(props) {
		super(props);
	}

	usersGet(_id) {
		if (this.userIsAdmin) {
			const args = {};

			if (_id) {
				args._id = _id;
			}

			return Meteor.users.find(args).fetch();
		}
		return new Error('Not authorized');
	}
}
