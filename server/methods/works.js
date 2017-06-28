import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Works from '/imports/api/collections/works';

Meteor.methods({
	'works.insert': (token, work) => {
		check(token, String);
		check(work, {
			title: String,
			tlg: String,
			tenantId: Match.Maybe(String),
			order: Match.Maybe(Number),
			subworks: Match.Maybe(Array)
		});

		if ('subworks' in work) {
			work.subworks.forEach((subwork) => {
				check(subwork.title, String);
				check(subwork.slug, String);
				check(subwork.n, Number);
			});
		}

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Works.insert(work);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'works.remove': (token, _id) => {
		check(token, String);
		check(_id, String);

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Works.remove(_id);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'works.update': (token, _id, work) => {
		check(token, String);
		check(_id, String);
		check(work, {
			title: String,
			tlg: Match.Maybe(String),
			tenantId: Match.Maybe(String),
			order: Match.Maybe(Number),
			subworks: Match.Maybe(Array)
		});

		if ('subworks' in work) {
			work.subworks.forEach((subwork) => {
				check(subwork.title, String);
				check(subwork.slug, String);
				check(subwork.n, Number);
			});
		}

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Works.update({
				_id
			}, {
				$set: work,
			});
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	}
});
