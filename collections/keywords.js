this.Keywords = new Meteor.Collection('keywords');

Schemas.Keywords = new SimpleSchema({

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

Keywords.attachSchema(Schemas.Keywords);
