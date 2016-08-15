this.Subworks = new Meteor.Collection('subworks');

Schemas.Subworks = new SimpleSchema({
  title: {
    type: String,
    max: 60
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

  n: {
    type: Number,
    min: 0
  },

  nComments: {
    type: Number,
		optional: true,
    min: 0
  },

	commentHeatmap: {
			type: [Object],
			optional: true
	},
	'commentHeatmap.$.n': {
			type: Number,
	},
	'commentHeatmap.$.nComments': {
			type: Number,
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

Subworks.attachSchema(Schemas.Subworks);
Subworks.friendlySlugs('title');
