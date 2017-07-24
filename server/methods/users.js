import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

Meteor.methods({
	'users.insert': (token, user) => {
		check(token, String);
		check(user, {
			username: String,
			password: String,
			emails: Array,
			profile: {
				name: String,
				biography: Match.Maybe(String),
				publicEmailAddress: Match.Maybe(String),
				academiaEdu: Match.Maybe(String),
				twitter: Match.Maybe(String),
				facebook: Match.Maybe(String),
				google: Match.Maybe(String),
				avatarUrl: Match.Maybe(String),
				location: Match.Maybe(String),
				country: Match.Maybe(String),
			},
			services: Match.Maybe(Object),
			roles: Match.Maybe(Array),
			canEditCommenters: Match.Maybe(Array),
			canAnnotateBooks: Match.Maybe(Array),
			authorOfBooks: Match.Maybe(Array),
			highlightingPreference: Match.Maybe(Boolean),
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			try {
				const userObject = {
					username: user.username,
					mail: user.emails[0].address,
					password: user.password,
				};

				// Create a new user with Accounts
				const newUserId = Accounts.createUser(userObject);

				// remove password before updating user obj
				delete user.password;

				// Update user profile and other metadata
				return Meteor.users.update({
					_id: newUserId,
				}, {
					$set: user,
				});
			} catch (err) {
				throw new Meteor.Error('meteor-ddp-admin', `Error with creating user: ${err}`);
			}
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'users.remove': (token, userId) => {
		check(token, String);
		check(userId, String);

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Meteor.users.remove(userId);

		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'users.update': (token, _id, user) => {
		check(token, String);
		check(_id, String);
		check(user, {
			username: String,
			emails: Match.Maybe(Array),
			profile: {
				name: Match.Maybe(String),
				biography: Match.Maybe(String),
				publicEmailAddress: Match.Maybe(String),
				academiaEdu: Match.Maybe(String),
				twitter: Match.Maybe(String),
				facebook: Match.Maybe(String),
				google: Match.Maybe(String),
				avatarUrl: Match.Maybe(String),
				location: Match.Maybe(String),
				country: Match.Maybe(String),
			},
			services: Match.Maybe(Object),
			roles: Match.Maybe(Array),
			canEditCommenters: Match.Maybe(Array),
			canAnnotateBooks: Match.Maybe(Array),
			authorOfBooks: Match.Maybe(Array),
			highlightingPreference: Match.Maybe(Boolean),
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Meteor.users.update({
				_id
			}, {
				$set: user,
			});
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	updatePosition: (token, _id, position) => {
		check(token, String);
		check(_id, String);
		check(position, {
			author: String,
			title: String,
			subtitle: String,
			link: String,
			activeElem: Number,
		});

		let user = Meteor.user();
		if (!user) {
			user = Meteor.users.findOne({
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
				_id,
			});
		}

		if (!user) {
			throw new Meteor.Error('recent-position-update', 'not-logged-in');
		}

		let recentPositions = user.recentPositions || [];
		let positionLinkIsInRecentPositions = false;

		recentPositions.forEach((recentPosition) => {
			if (recentPosition.link === position.link) {
				recentPosition.activeElem = position.activeElem;
				recentPosition.title = position.title;
				recentPosition.subtitle = position.subtitle;
				recentPosition.author = position.author;
				positionLinkIsInRecentPositions = true;
			}
		});

		if (!positionLinkIsInRecentPositions) {
			if (recentPositions.length > 100) {
				recentPositions = recentPositions.slice(1);
			}
			recentPositions.push(position);
		}

		return Meteor.users.update({
			_id
		}, {
			$set: {
				recentPositions,
			},
		});
	},
});
