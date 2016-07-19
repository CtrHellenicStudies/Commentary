this.Revisions = new Meteor.Collection('revisions');

Schemas.Revisions = new SimpleSchema({

  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },

  updatedAt: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    }
  }

});

Revisions.attachSchema(Schemas.Revisions);
