this.Comments = new Meteor.Collection('comments');

Schemas.Comments = new SimpleSchema({
  wordpressId: {
    type: Number,
    optional: true
  },

  commenters: {
    type: [Schemas.Commenters],
    optional: true,

  },

  work: {
    type: Schemas.Works,

  },

  subwork: {
    type: Schemas.Subworks,

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

  keywords: {
    type: [Schemas.Keywords],
    optional: true
  },

  revisions: {
    type: [Schemas.Revisions],
    optional: true
  },


  discussionComments: {
    type: [Schemas.DiscussionComments],
    optional: true
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

Comments.attachSchema(Schemas.Comments);
