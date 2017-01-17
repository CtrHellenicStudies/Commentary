import { Meteor } from 'meteor/meteor';

Meteor.methods({
  findTenantBySubdomain: (subdomain) => {
      check(subdomain, String);

      Tenants.upsert({
        subdomain: subdomain
      }, {
        $set: {
          subdomain: subdomain
        }
      });

    let tenant = Tenants.findOne({ subdomain: subdomain });
    if (tenant) {
      return tenant._id;
    }

  }
});
