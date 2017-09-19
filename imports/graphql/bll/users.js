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

	userUpdate(_id, user) {
		if (this.userIsAdmin) {
			Meteor.users.update(_id, {$set: user});
			return Meteor.users.findOne(_id);
		}
		return new Error('Not authorized');
	}

	userRemove(userId) {
		if (this.userIsAdmin) {
			return Meteor.users.remove({_id: userId});
		}
		return new Error('Not authorized');
	}

	userCreate(user) {
		if (this.userIsAdmin) {

			const newUser = user;

			const userObject = {
				username: user.username,
				mail: user.emails[0].address,
				password: user.password,
			};
			const newUserId = Accounts.createUser(userObject);

			delete newUser.password;

			Meteor.users.update({
				_id: newUserId,
			}, {
				$set: newUser,
			});

			return Meteor.users.findOne(newUserId);
		}
		return new Error('Not authorized');
	}
}
