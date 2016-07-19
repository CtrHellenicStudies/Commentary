this.DiscussionComments = new Meteor.Collection('discussion_comment');

Schemas.DiscussionComments = new SimpleSchema({
  text: {
    type: String,
    autoform: {
      rows: 5
    }
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

DiscussionComments.attachSchema(Schemas.DiscussionComments);
