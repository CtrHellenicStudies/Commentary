import { Meteor } from 'meteor/meteor';

Meteor.methods({
  findTenantBySubdomain(subdomain) {
    check(subdomain, String);

    let tenant = Tenants.findOne({ subdomain: subdomain });
    if (tenant) {
      return tenant._id;
    } else {
      return null;
    }

  },
});
