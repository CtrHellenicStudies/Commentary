const Tenants = new Meteor.Collection('tenants');

Tenants.schema = new SimpleSchema({
  subdomain: {
    type: String
  },
  isAnnotation: {
    type: Boolean,
  }
});

Tenants.attachSchema(Tenants.schema);

export default Tenants;
