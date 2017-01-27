import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

  if (Tenants.find().count() == 0) {
    let tenantId = Tenants.insert({
      subdomain: "homer"
    });

    Commenters.update({}, {
      $set: {
        tenantId: tenantId
      }
    });

    Comments.update({}, {
      $set: {
        tenantId: tenantId
      }
    });

    DiscussionComments.update({}, {
      $set: {
        tenantId: tenantId
      }
    });

    Keywords.update({}, {
      $set: {
        tenantId: tenantId
      }
    });

    ReferenceWorks.update({}, {
      $set: {
        tenantId: tenantId
      }
    });

    TextNodes.update({}, {
      $set: {
        tenantId: tenantId
      }
    });

    Works.update({}, {
      $set: {
        tenantId: tenantId
      }
    });

  }

});
