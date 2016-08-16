this.DiscussionComments = new Meteor.Collection('discussionComments');

Schemas.DiscussionComments = new SimpleSchema({
  user: {
    type: Object,
		// Come back to this after redefining the user schemas
		blackbox: true
  },
  content: {
    type: String,
    optional: true,
  },
  parentId: {
    type: String,
    optional: true,
  },
  commentId: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    optional: true,
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
