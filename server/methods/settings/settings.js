import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

import Settings from '/imports/models/settings.js';


/**
 * Settings methods - either replaced or to be replaced with the graphql api
 */

const settingsInsert = (token, setting) => {
	check(token, String);
	check(setting, {
		tenantId: String,
		name: String,
		domain: String,
		title: String,
		subtitle: Match.Maybe(String),
		footer: String,
		emails: {
			from: String,
			contact: String,
		},
		webhooksToken: String,
		discussionCommentsDisabled: Boolean,
		homepageCover: Match.Maybe(Match.OneOf(Object, undefined)),
		homepageIntroductionImage: Match.Maybe(Match.OneOf(Object, undefined)),
		homepageIntroductionImageCaption: Match.Maybe(Match.OneOf(String, undefined)),
		introBlocks: [{
			title: Match.Maybe(String),
			text: Match.Maybe(String),
			linkURL: Match.Maybe(String),
			linkText: Match.Maybe(String),
		}],
	});
	let ret;
	if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
		ret = Settings.insert(setting);
		return ret;
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

const settingsUpdate = (token, _id, setting) => {
	check(token, String);
	check(_id, String);
	check(setting, {
		tenantId: String,
		name: String,
		domain: String,
		title: String,
		subtitle: Match.Maybe(String),
		footer: String,
		emails: {
			from: String,
			contact: String,
		},
		webhooksToken: String,
		discussionCommentsDisabled: Boolean,
		homepageCover: Match.Maybe(Match.OneOf(Object, undefined)),
		homepageIntroductionImage: Match.Maybe(Match.OneOf(Object, undefined)),
		homepageIntroductionImageCaption: Match.Maybe(Match.OneOf(String, undefined)),
		introBlocks: [{
			title: Match.Maybe(String),
			text: Match.Maybe(String),
			linkURL: Match.Maybe(String),
			linkText: Match.Maybe(String),
		}],
	});

	if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
		return Settings.update({
			_id
		}, {
			$set: setting,
		});
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};

const settingsRemove = (token, settingId) => {
	check(token, String);
	check(settingId, String);

	if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
		return Settings.remove({ _id: settingId });
	}

	throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
};


Meteor.methods({
	'settings.insert': settingsInsert,
	'settings.update': settingsUpdate,
	'settings.remove': settingsRemove,
});

export { settingsInsert, settingsUpdate, settingsRemove };
