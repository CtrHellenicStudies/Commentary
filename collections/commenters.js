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

	slug: {
		type: String,
		max: 200,
		optional: true,
		autoform: {
			type: "hidden",
			label: false
		}
	},

	picture: {
		type: String,
		optional: true,
		label: 'Profile picture',
		autoform: {
			afFieldInput: {
				type: 'fileUpload',
				collection: 'ProfilePictures'
			}
		}
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

	featureOnHomepage: {
		type: Boolean,
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

Commenters.attachSchema(Schemas.Commenters);
Commenters.friendlySlugs('name');
