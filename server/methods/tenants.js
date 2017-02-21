import { Meteor } from 'meteor/meteor';
import Tenants from '/imports/collections/tenants';

Meteor.methods({
	findTenantBySubdomain(subdomain) {
		check(subdomain, String);
		return Tenants.findOne({ subdomain });
	},
});
