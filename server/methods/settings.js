import { Meteor } from 'meteor/meteor';

import Settings from '/imports/collections/settings.js';

Meteor.methods({
  'settings.insert'(data) {
    check(data, Object);

    return Settings.insert({
      name: data.name,
      domain: data.domain,
      title: data.title,
      subtitle: data.subtitle,
      footer: data.footer,
      emails: {
        from: data.fromEmail,
        contact: data.contactEmail
      },
      tenantId: data.tenantId
    });
  },
  'settings.remove'(settingId) {
    check(settingId, String);

    Settings.remove({ _id: settingId });
  }
});
