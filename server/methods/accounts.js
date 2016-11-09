Meteor.methods({
	updateAccount(accountData) {
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		check(accountData, Object);

		// check(accountData.name, String);
		// check(accountData.biography, String);
		// check(accountData.academiaEdu, String);
		// check(accountData.twitter, String);
		// check(accountData.facebook, String);
		// check(accountData.google, String);

		return Meteor.users.update({
			_id: this.userId,

		}, {
			$set: {
				username: accountData.username,
				'profile.name': accountData.name,
				'profile.biography': accountData.biography,
				'profile.academiaEdu': accountData.academiaEdu,
				'profile.twitter': accountData.twitter,
				'profile.facebook': accountData.facebook,
				'profile.google': accountData.google,
			},

		});
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
});
