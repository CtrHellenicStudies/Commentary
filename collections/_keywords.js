this.Keywords = new Meteor.Collection('keywords');

Schemas.Keywords = new SimpleSchema({
  wordpressId: {
    type: Number,
    optional: true,
  },

  title: {
    type: String,
    optional: true,
  },

  slug: {
    type: String,
    optional: true,
  },

  description: {
    type: String,
    optional: true,
  },

  count: {
    type: Number,
    optional: true,
  },

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
