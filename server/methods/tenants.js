import { Meteor } from 'meteor/meteor';
import Tenants from '/imports/collections/tenants';

Meteor.methods({
	findTenantBySubdomain(subdomain) {
		check(subdomain, String);
		return Tenants.findOne({ subdomain });
	},
      tenants() {
        return Tenants.find().fetch();
      },
      'tenants.insert'(data) {
        check(data, Object);

        return Tenants.insert(data);
      },
      'tenants.remove'(tenantId) {
        check(tenantId, String);

        Tenants.remove(tenantId);
      }
});
