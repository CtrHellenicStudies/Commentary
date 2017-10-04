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

			return Meteor.users.find(
				args,
				{
					fields: {
						username: 1,
						emails: 1,
						profile: 1,
						services: 1,
						subscriptions: 1,
						roles: 1,
						highlightingPreference: 1,
						canAnnotateBooks: 1,
						authorOfBooks: 1,
						canEditCommenters: 1,
						recentPositions: 1,
					},
					sort: {
						'profile.name': 1,
						'emails.address': 1,
						username: 1,
					},
				}
			).fetch();
		}

		// TODO: determine best handling for users that aren't administrators
		// return new Error('Not authorized');
		return [];
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

	getAuthedUser() {
		return this.user;
	}

	userGetPublicById(_id) {
		return Meteor.users.findOne(
			{
				_id,
			},
			{
				fields: {
					username: 1,
					profile: 1,
					services: 1,
					subscriptions: 1,
					roles: 1,
					highlightingPreference: 1,
					canAnnotateBooks: 1,
					authorOfBooks: 1,
					canEditCommenters: 1,
					recentPositions: 1,
				},
				sort: {
					'profile.name': 1,
					'emails.address': 1,
					username: 1,
				},
			}
		);
	}

	usersGetPublicById(userIds) {
		return Meteor.users.find(
			{
				_id: {
					$in: userIds,
				},
			},
			{
				fields: {
					username: 1,
					profile: 1,
					services: 1,
					subscriptions: 1,
					roles: 1,
					highlightingPreference: 1,
					canAnnotateBooks: 1,
					authorOfBooks: 1,
					canEditCommenters: 1,
					recentPositions: 1,
				},
				sort: {
					'profile.name': 1,
					'emails.address': 1,
					username: 1,
				},
			}
		).fetch();
	}

	userUpdatePosition(position) {
		if (!this.user) {
			throw new Meteor.Error('recent-position-update', 'not-logged-in');
		}

		let recentPositions = this.user.recentPositions || [];
		let positionLinkIsInRecentPositions = false;

		if (recentPositions.length > 10) {
			recentPositions = recentPositions.slice(1);
		}
		recentPositions.push(position);

		console.log(recentPositions);

		Meteor.users.update({
			_id: this.user._id,
		}, {
			$set: {
				recentPositions,
			},
		});

		return Meteor.users.findOne({
			_id: this.user._id,
		});
	}
}
