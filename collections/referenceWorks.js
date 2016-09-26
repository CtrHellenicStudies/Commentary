this.ReferenceWorks = new Meteor.Collection('referenceWorks');

Schemas.ReferenceWorks = new SimpleSchema({
	title: {
		type: String,
		optional: true,
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

	link: {
		type: String,
		optional: true,
		regEx: SimpleSchema.RegEx.Url, // for http, https and ftp urls
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

ReferenceWorks.attachSchema(Schemas.ReferenceWorks);
ReferenceWorks.friendlySlugs('title');
