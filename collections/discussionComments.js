this.DiscussionComments = new Meteor.Collection('discussionComments');

Schemas.DiscussionComments = new SimpleSchema({
  user: {
    type: Schemas.User,
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
    type: String,
  },
  status: {
    type: String,
  },
  votes: {
    type: Number,
    optional: true,
  },
  voters: {
    type: [Schemas.User],
    optional: true,
  },
	
  created: {
    type: Date,
    optional: true,
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

DiscussionComments.attachSchema(Schemas.DiscussionComments);
