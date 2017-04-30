import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

import Pages from '/imports/api/collections/pages.js';

Meteor.methods({
	'pages.insert': (token, page) => {
		check(token, String);
		check(page, {
			title: String,
			slug: String,
			subtitle: Match.Maybe(String),
			byline: Match.Maybe(String),
			headerImage: Match.Maybe(String),
			tenantId: Match.Maybe(String),
			content: Match.Maybe(String),
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Pages.insert(page);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'pages.update': (token, _id, page) => {
		check(token, String);
		check(_id, String);
		check(page, {
			title: String,
			slug: String,
			subtitle: Match.Maybe(String),
			byline: Match.Maybe(String),
			headerImage: Match.Maybe(String),
			tenantId: Match.Maybe(String),
			content: Match.Maybe(String),
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Pages.update({
				_id
			}, {
				$set: page,
			});
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'pages.remove': (token, pageId) => {
		check(token, String);
		check(pageId, String);

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Pages.remove({ _id: pageId });
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	}
});
