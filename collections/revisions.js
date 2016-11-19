this.Revisions = new Meteor.Collection('revisions');

Schemas.Revisions = new SimpleSchema({
	title: {
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

	text: {
		type: String,
		optional: true,
		autoform: {
			rows: 5,
		},

	},

	created: {
		type: Date,
		optional: true,
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

Revisions.attachSchema(Schemas.Revisions);
Revisions.friendlySlugs('title');
