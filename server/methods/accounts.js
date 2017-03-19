Meteor.methods({
	updateAccount(field, value) {
		if (!this.userId) {
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
					_id: this.userId,

				}, setModifier
			);
		} catch (err) {
			console.error(err);
			return false;
		}
		return result;
	},
	deleteAccount(userId) {
		check(userId, String);

		if (this.userId === userId) {
			return Meteor.users.remove({
				_id: this.userId,
			});
		}
		return false;
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
});
