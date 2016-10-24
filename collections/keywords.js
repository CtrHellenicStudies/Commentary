this.Keywords = new Meteor.Collection('keywords');

Schemas.Keywords = new SimpleSchema({
    										_id: {
        										type: String,
    },

	wordpressId: {
		type: Number,
		optional: true,
	},

	title: {
		type: String,
		// optional: true,
	},

	slug: {
		type: String,
		max: 200,
		optional: true,
		autoform: {
			type: 'hidden',
			label: false,
		},
	},

	description: {
		type: String,
		optional: true,
	},

	type: {
		type: String,
		optional: true,
		defaultValue: 'word',
	},

	count: {
		type: Number,
		optional: true,
	},
	created: {
		type: Date,
		optional: true,
		autoValue() {
			if (this.isInsert) {
				return new Date;
			}
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
	},
	updated: {
		type: Date,
		optional: true,
		autoValue() {
			if (this.isUpdate) {
				return new Date;
			}
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
	},

});

Keywords.attachSchema(Schemas.Keywords);
Keywords.friendlySlugs('title');
