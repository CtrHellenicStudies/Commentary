this.Comments = new Meteor.Collection('comments');

Schemas.Comments = new SimpleSchema({

/*
  wordpressId: {
    type: Number,
    optional: true
  },

  commenters: {
    type: [Commenters],
    optional: true,

  },

  work: {
    type: Works,

  },

  subwork: {
    type: Subworks,

  },

  lineFrom: {
    type: Number,
  },

  lineTo: {
    type: Number,
    optional: true
  },

  lineLetter: {
    type: String,
    optional: true
  },

  nLines: {
    type: Number,
    optional: true
  },

  commentOrder: {
    type: Number,
    optional: true
  },

  reference: {
    type: String,
    optional: true
  },

  referenceLink: {
    type: String,
    optional: true
  },

  referenceSection: {
    type: Number,
    optional: true
  },

  referenceChapter: {
    type: Number,
    optional: true
  },

  referenceTranslation: {
    type: Number,
    optional: true
  },

  referenceNote: {
    type: Number,
    optional: true
  },

  /*keywords: {
    type: [Keywords],
    optional: true
  },

  revisions: {
    type: [Revisions],
    optional: true
  },
  */

  /*discussionComments: {
    type: [DiscussionComments],
    optional: true
  },*/

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

Comments.attachSchema(Schemas.Comments);
