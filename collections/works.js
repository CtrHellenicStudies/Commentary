this.Works = new Meteor.Collection('works');

Schemas.Works = new SimpleSchema({
	title: {
		type: String,
		max: 60,
	},
	tenant: {
		type: String,
		optional: true,
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
	order: {
		type: Number,
	},

	nComments: {
		type: Number,
		optional: true,
		min: 0,
	},

	subworks: {
		type: [Schemas.Subworks],
		optional: true,
	},
	created: {
		type: Date,
		optional: true,
		autoValue() {
			if (this.isInsert) {
				return new Date();
			}
			return null;
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
				return new Date();
			}
			return null;
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
	},
});

Works.attachSchema(Schemas.Works);
Works.friendlySlugs('title');
