import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

import Keywords from '/imports/models/keywords';


const keywordsInsert = (token, keywords) => {
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
		description: Match.Maybe(String),
		descriptionRaw: Match.Maybe(Object),
		count: Match.Maybe(Number),
	}]);

	const roles = ['editor', 'admin', 'commenter'];
	if (!Meteor.users.findOne({
		roles: { $elemMatch: { $in: roles } },
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
};

const keywordsUpdate = (token, id, keywordCandidate) => {
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
		description: Match.Maybe(String),
		descriptionRaw: Match.Maybe(Object),
		count: Match.Maybe(Number),
	});

	const roles = ['editor', 'admin', 'commenter'];
	if (!Meteor.users.findOne({
		roles: { $elemMatch: { $in: roles } },
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
};

const keywordsDelete = (token, keywordId) => {
	check(token, String);
	check(keywordId, String);

	const roles = ['editor', 'admin', 'commenter'];
	if (!Meteor.users.findOne({
		roles: { $elemMatch: { $in: roles } },
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
};

const keywordsChangeType = (token, id, newType) => {
	check(token, String);
	check(id, String);
	check(newType, String);

	const roles = ['editor', 'admin', 'commenter'];
	if (!Meteor.users.findOne({
		roles: { $elemMatch: { $in: roles } },
		'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
	})
	) {
		throw new Meteor.Error('keyword-delete', 'not-authorized');
	}

	try {
		Keywords.update({ _id: id }, {$set: {type: newType}});
	} catch (err) {
		throw new Meteor.Error('keyword-changeType', err);
	}

	return id;
};

Meteor.methods({
	'keywords.insert': keywordsInsert,

	'keywords.update': keywordsUpdate,

	'keywords.delete': keywordsDelete,

	'keywords.changeType': keywordsChangeType,

});

export { keywordsInsert, keywordsUpdate, keywordsDelete, keywordsChangeType };
