import { Meteor } from 'meteor/meteor';

Meteor.methods({
  findTenantBySubdomain(subdomain) {
    check(subdomain, String);

    return Tenants.findOne({ subdomain: subdomain });

  },
});
