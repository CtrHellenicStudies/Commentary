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
    max: 200,
    optional: true,
    autoform: {
      type: "hidden",
      label: false
    }
  },

  description: {
    type: String,
    optional: true,
  },

  count: {
    type: Number,
    optional: true,
  },
  created: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      }
    },
    autoform: {
      type: "hidden",
      label: false
    }
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date;
      }
    },
    autoform: {
      type: "hidden",
      label: false
    }
  }

});

Keywords.attachSchema(Schemas.Keywords);
Keywords.friendlySlugs('title');
