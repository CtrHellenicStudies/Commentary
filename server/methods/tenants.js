import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Tenants from '/imports/collections/tenants';

Meteor.methods({
	findTenantBySubdomain(subdomain) {
		check(subdomain, String);
		return Tenants.findOne({ subdomain });
	},
	tenants() {
		return Tenants.find().fetch();
	},
	'tenants.insert': (tenant) => {
		check(tenant, {
			subdomain: String,
			isAnnotation: Match.Maybe(Boolean),
		});

		return Tenants.insert(tenant);
	},
	'tenants.remove': (tenantId) => {
		check(tenantId, String);

		Tenants.remove(tenantId);
	},
	'tenants.update': (_id, tenant) => {
		check(_id, String);
		check(tenant, {
			subdomain: String,
			isAnnotation: Match.Maybe(Boolean),
		});

		Tenants.update({
			_id
		}, {
			$set: tenant,
		});
	}
});
