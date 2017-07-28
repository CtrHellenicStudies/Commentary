import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const accountsMethods = {
	createAccount(user) {
		check(user, {
			email: String,
			password: {
				digest: String,
				algorithm: String,
			},
		});

		const userId = Accounts.createUser(user);
		const stampedToken = Accounts._generateStampedLoginToken();
		Accounts._insertLoginToken(userId, stampedToken);
		return { userId, stampedToken };
	},
	createAccountHTTPS(user) {
		check(user, {
			email: String,
			password: String,
		});

		user.username = user.email; 

		const userId = Accounts.createUser(user);
		const stampedToken = Accounts._generateStampedLoginToken();
		Accounts._insertLoginToken(userId, stampedToken);

		return { userId, stampedToken };
	},
	updateAccount(field, value) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		check(field, String);
		check(value, Match.OneOf(String, [Object]));
		const setModifier = { $set: {} };
		setModifier.$set[field] = value;
		let result;
		try {
			result = Meteor.users.update(
				{
					_id: Meteor.userId(),

				}, setModifier
			);
		} catch (err) {
			throw new Meteor.Error('user update failed');
		}
		return result;
	},
	deleteAccount(userId) {
		check(userId, String);

		if (Meteor.userId() === userId) {
			return Meteor.users.remove({
				_id: Meteor.userId(),
			});
		}
		throw new Meteor.Error('not-authorized');
	},
	currentAdminUser() {
		return Meteor.users.findOne({ _id: Meteor.userId(), roles: {$in: ['admin']} });
	},
	getNewStampedToken() {
		const userId = Meteor.userId();

		if (!userId) {
			throw new Meteor.Error('custom-accounts', 'getNewStampedToken called but user is not logged in');
		}

		const stampedToken = Accounts._generateStampedLoginToken();
		const hashStampedToken = Accounts._hashLoginToken(stampedToken.token);
		Meteor.users.update(userId,
			{
				$push: {
					'services.resume.loginTokens': {
						when: stampedToken.when,
						hashedToken: hashStampedToken,
					}
				}
			});

		return stampedToken.token;
	},
};

Meteor.methods(accountsMethods);

export default accountsMethods;
