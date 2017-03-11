import Keywords from '/imports/collections/keywords';

Meteor.methods({
	'keywords.insert': (token, keywords) => {
		check(token, String);
		check(keywords, [{
			title: String,
			slug: String,
			tenantId: String,
			type: String,
			work: Match.Maybe({
				title: Match.Maybe(String),
				slug: Match.Maybe(String),
				order: Match.Maybe(Number),
			}),
			subwork: Match.Maybe({
				title: Match.Maybe(String),
				slug: Match.Maybe(String),
				n: Match.Maybe(Number),
			}),
			lineFrom: Match.Maybe(Number),
			lineTo: Match.Maybe(Number),
			lineLetter: Match.Maybe(String),
		}]);

		const roles = ['developer', 'admin', 'commenter'];
		if ((
				!Meteor.userId()
				&& !Roles.userIsInRole(Meteor.user(), roles)
			)
			&& !Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})
		) {
			throw new Meteor.Error('keyword-insert', 'not-authorized');
		}

		const keywordsIds = [];

		keywords.forEach((keyword) => {
			try {
				const keywordId = Keywords.insert(keyword);
				keywordsIds.push(keywordId);
			} catch (err) {
				throw new Meteor.Error('keyword-insert', err);
			}
		});

		return keywordsIds;
	},

	'keywords.update': (token, id, keywordCandidate) => {
		check(token, String);
		check(id, String);
		check(keywordCandidate, {
			title: String,
			slug: String,
			tenantId: String,
			type: String,
			work: Match.Maybe({
				title: Match.Maybe(String),
				slug: Match.Maybe(String),
				order: Match.Maybe(Number),
			}),
			subwork: Match.Maybe({
				title: Match.Maybe(String),
				slug: Match.Maybe(String),
				n: Match.Maybe(Number),
			}),
			lineFrom: Match.Maybe(Number),
			lineTo: Match.Maybe(Number),
			lineLetter: Match.Maybe(String),
		});

		const roles = ['developer', 'admin', 'commenter'];
		if ((
				!Meteor.userId()
				&& !Roles.userIsInRole(Meteor.user(), roles)
			)
			&& !Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})
		) {
			throw new Meteor.Error('keyword-update', 'not-authorized');
		}

		try {
			Keywords.update({ _id: id }, { $set: keywordCandidate });
		} catch (err) {
			throw new Meteor.Error('keyword-update', err);
		}

		return id;
	},

	'keywords.delete': (token, keywordId) => {
		check(token, String);
		check(keywordId, String);

		const roles = ['developer', 'admin', 'commenter'];
		if ((
				!Meteor.userId()
				&& !Roles.userIsInRole(Meteor.user(), roles)
			)
			&& !Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})
		) {
			throw new Meteor.Error('keyword-delete', 'not-authorized');
		}

		try {
			Keywords.remove({ _id: keywordId });
		} catch (err) {
			throw new Meteor.Error('keyword-delete', err);
		}

		return keywordId;
	},
});
