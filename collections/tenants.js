this.Tenants = new Meteor.Collection('tenants');

Schemas.Tenants = new SimpleSchema({
  subdomain: {
    type: String
  },
});

Tenants.attachSchema(Schemas.Tenants);
