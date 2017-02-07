import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

  let tenants = Tenants.find({ isAnnotation: {$exists: false} });
  if (tenants.count() > 0) {
    _.map(tenants.fetch(), (tenant) => {
      Tenants.update({ _id: tenant._id }, {
        $set: {
          isAnnotation: false
        }
      });
    })

  }

});
