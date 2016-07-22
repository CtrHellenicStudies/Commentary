this.Commenters = new Meteor.Collection('commenters');

Schemas.Commenters = new SimpleSchema({
  wordpressId: {
    type: Number,
    optional: true
  },

  name: {
    type: String,
    optional: true,
    max: 255
  },

  bio: {
    type: String,
    optional: true,
    autoform: {
      rows: 5
    }
  },

  tagline: {
    type: String,
    optional: true,
  },

  nCommentsPerBook: {
    type: Number,
    optional: true,
  },

  nCommentsPerKeyword: {
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

Commenters.attachSchema(Schemas.Commenters);
