this.Tenants = new Meteor.Collection('tenants');

Schemas.Tenants = new SimpleSchema({
  subdomain: {
    type: String
  },
  isAnnotation: {
    type: Boolean,
    autoform: {
      type: "boolean-checkbox",
      label: "isAnnotation"
    }
  }
});

Tenants.attachSchema(Schemas.Tenants);
