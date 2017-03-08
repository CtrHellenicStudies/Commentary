import { Meteor } from 'meteor/meteor';
import ReferenceWorks from '/imports/collections/referenceWorks';

Meteor.methods({
	'referenceWorks.insert'(token, data) {
		check(token, String);
		check(referenceWork, {
			title: String,
			tenantId: Match.Maybe(String),
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return ReferenceWorks.insert(data);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'referenceWorks.remove'(token, referenceWorkId) {
		check(token, String);
		check(referenceWorkId, String);

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return ReferenceWorks.remove(referenceWorkId);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'referenceWorks.update'(token, _id, referenceWork) {
		check(token, String);
		check(_id, String);
		check(referenceWork, {
			title: String,
			tenantId: Match.Maybe(String),
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return ReferenceWorks.update({
				_id
			}, {
				$set: referenceWork,
			});
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	}
});
