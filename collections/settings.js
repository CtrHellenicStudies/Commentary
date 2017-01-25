this.Settings = new Meteor.Collection('settings');

Schemas.Settings = new SimpleSchema({
  name: {
    type: String
  },
  domain: {
    type: String
  },
  title: {
    type: String
  },
  subtitle: {
    type: String
  },
  logo: {
    type: String
  },
  footer: {
    type: String
  },
  emails: {
    type: Object
  },
  "emails.from": {
    type: String
  },
  "emails.contact": {
    type: String
  },
  defaultLanguage: {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return 'en';
      }
    }
  },
  dateFormat: {
    type: String,
    autoValue: function () {
      if (this.isInsert) {
        return 'D/M/YYYY';
      }
    }
  },
  legal: {
    type: Object
  },
  "legal.address": {
    type: String
  },
  "legal.name": {
    type: String
  },
  tenantId: {
      type: String,
      label: "Tenant",
      optional: true,
      autoform: {
        afFieldInput: {
          type: "select",
          options: function () {
            var tenants = [];
            _.map(Tenants.find().fetch(), function (tenant) {

              tenants.push({
                label: tenant.subdomain,
                value: tenant._id
              });

            });
            return tenants;
          }
        }
      }
  },
});

Settings.attachSchema(Schemas.Settings);
Settings.friendlySlugs('name');
Settings.attachBehaviour('timestampable');
