const Tenants = new Meteor.Collection('tenants');

Tenants.schema = new SimpleSchema({
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

Tenants.attachSchema(Tenants.schema);

export default Tenants;
