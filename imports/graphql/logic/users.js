import {Meteor} from 'meteor/meteor';
import AdminService from './adminService';

/**
 * Logic-layer service for dealing with users
 */
export default class UserService extends AdminService {

	/**
	 * Get users (admin method)
	 * @param {string} _id - id of user
	 * @returns {Object[]} array of users
	 */
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

	/**
	 * Update a user
	 * @param {string} _id - id of user
	 * @param {Object} user - user to update
	 * @returns {Object} updated user record
	 */
	userUpdate(_id, user) {
		if (this.userIsAdmin) {
			Meteor.users.update(_id, {$set: user});
			return Meteor.users.findOne(_id);
		}
		return new Error('Not authorized');
	}

	/**
	 * Remove a user
	 * @param {string} userId - id of user
	 * @returns {boolean} result from mongo orm remove
	 */
	userRemove(userId) {
		if (this.userIsAdmin) {
			return Meteor.users.remove({_id: userId});
		}
		return new Error('Not authorized');
	}

	/**
	 * Create a user
	 * @param {Object} user - candidate user to create
	 * @returns {Object} newly created user
	 */
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

	/**
	 * Get the user information of the user currently logged in to Meteor
	 * @returns {Object} the user data for the currently logged in user
	 */
	getAuthedUser() {
		return this.user;
	}

	/**
	 * Get a user's public information by their id
	 * @param {string} _id - id of user
	 * @returns {Object} the user data
	 */
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

	/**
	 * Get multiple users' public information by their id
	 * @param {string[]} userIds - an array of user ids
	 * @returns {Object[]} array of user data
	 */
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

	/**
	 * Update the most recent position of given users
	 * @param {Object} position - position information about where a user was most
	 *    recently reading
	 * @returns {Object} updated user record
	 */
	userUpdatePosition(position) {
		if (!this.user) {
			throw new Meteor.Error('recent-position-update', 'not-logged-in');
		}

		let recentPositions = this.user.recentPositions || [];
		const positionLinkIsInRecentPositions = false;

		if (recentPositions.length > 10) {
			recentPositions = recentPositions.slice(1);
		}
		recentPositions.push(position);

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
