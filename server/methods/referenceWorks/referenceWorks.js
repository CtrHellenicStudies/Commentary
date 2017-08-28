import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

import ReferenceWorks from '/imports/models/referenceWorks';

const referenceWorksInsert = (token, referenceWork) => {
	check(token, String);
	check(referenceWork, {
		title: String,
		slug: String,
		tenantId: Match.Maybe(String),
		authors: Match.Maybe(Array),
		coverImage: Match.Maybe(String),
	});

	if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
		return ReferenceWorks.insert(referenceWork);
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

const referenceWorksUpdate = (token, _id, referenceWork) => {
	check(token, String);
	check(_id, String);
	check(referenceWork, {
		title: String,
		slug: String,
		tenantId: Match.Maybe(String),
		authors: Match.Maybe(Array),
		coverImage: Match.Maybe(String),
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
};

const referenceWorksRemove = (token, referenceWorkId) => {
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
};


Meteor.methods({
	'referenceWorks.insert': referenceWorksInsert,
	'referenceWorks.update': referenceWorksUpdate,
	'referenceWorks.remove': referenceWorksRemove,
});

export { referenceWorksInsert, referenceWorksUpdate, referenceWorksRemove };
