import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

import Works from '/imports/models/works';


/**
 * Works methods - either replaced or to be replaced with the graphql api
 */

const worksInsert = (token, work) => {
	check(token, String);
	check(work, {
		title: String,
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
};

const worksUpdate = (token, _id, work) => {
	check(token, String);
	check(_id, String);
	check(work, {
		title: String,
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
};

const worksRemove = (token, _id) => {
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
};


Meteor.methods({
	'works.insert': worksInsert,
	'works.update': worksUpdate,
	'works.remove': worksRemove,
});

export { worksInsert, worksUpdate, worksRemove };
