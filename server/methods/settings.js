import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import Settings from '/imports/collections/settings.js';

Meteor.methods({
	'settings.insert': (token, setting) => {
		check(token, String);
		check(setting, {
			name: String,
			domain: String,
			title: String,
			footer: String,
			emails: Object,
			tenantId: Match.Maybe(String),
			subtitle: Match.Maybe(String),
			homepageCover: Match.Maybe(String),
			homepageIntroductionTitle: Match.Maybe(String),
			homepageIntroductionImage: Match.Maybe(String),
			homepageIntroductionImageCaption: Match.Maybe(String),
			homepageIntroductionText: Match.Maybe(String),
			homepageIntroductionLink: Match.Maybe(String),
			homepageIntroductionLinkText: Match.Maybe(String),
			webhooksToken: String,
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Settings.insert(setting);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'settings.update': (token, _id, setting) => {
		check(token, String);
		check(_id, String);
		check(setting, {
			name: String,
			domain: String,
			title: String,
			footer: String,
			emails: Object,
			tenantId: Match.Maybe(String),
			subtitle: Match.Maybe(String),
			homepageCover: Match.Maybe(String),
			homepageIntroductionTitle: Match.Maybe(String),
			homepageIntroductionImage: Match.Maybe(String),
			homepageIntroductionImageCaption: Match.Maybe(String),
			homepageIntroductionText: Match.Maybe(String),
			homepageIntroductionLink: Match.Maybe(String),
			homepageIntroductionLinkText: Match.Maybe(String),
			webhooksToken: String,
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
	},
	'settings.remove': (token, settingId) => {
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
	}
});
