import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import Settings from '/imports/api/collections/settings.js';

Meteor.methods({
	'settings.insert': (token, setting) => {
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
			homepageCover: Match.Maybe(Object),
			homepageIntroductionImage: Match.Maybe(Object),
			homepageIntroductionImageCaption: Match.Maybe(String),
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
			return Settings.insert(setting);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'settings.update': (token, _id, setting) => {
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
			homepageCover: Match.Maybe(Object),
			homepageIntroductionImage: Match.Maybe(Object),
			homepageIntroductionImageCaption: Match.Maybe(String),
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
