this.DiscussionComments = new Meteor.Collection('discussion_comments');

Schemas.DiscussionComments = new SimpleSchema({
  /*user: {
    type: User,
  },
  content: {
    type: String,
    optional: true,
  },
  parentId: {
    type: Number,
    optional: true,
  },
  comment: {
    type: Comments,
  },
  status: {
    type: String,
  },
  votes: {
    type: Number,
    optional: true,
  },
  /*voters: {
    type: [User],
    optional: true,
  },
  */
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
