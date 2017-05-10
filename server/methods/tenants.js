import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Tenants from '/imports/api/collections/tenants';

Meteor.methods({
	findTenantBySubdomain(subdomain) {
		check(subdomain, String);
		return Tenants.findOne({ subdomain });
	},
	tenants() {
		return Tenants.find().fetch();
	},
	'tenants.insert': (token, tenant) => {
		check(token, String);
		check(tenant, {
			subdomain: String,
			isAnnotation: Match.Maybe(Boolean),
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Tenants.insert(tenant);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'tenants.remove': (token, tenantId) => {
		check(token, String);
		check(tenantId, String);

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Tenants.remove(tenantId);
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	},
	'tenants.update': (token, _id, tenant) => {
		check(token, String);
		check(_id, String);
		check(tenant, {
			subdomain: String,
			isAnnotation: Match.Maybe(Boolean),
		});

		if (
			Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})) {
			return Tenants.update({
				_id
			}, {
				$set: tenant,
			});
		}

		throw new Meteor.Error('meteor-ddp-admin', 'Attempted publishing with invalid token');
	}
});
