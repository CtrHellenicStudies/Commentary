Schemas.UserProfile = new SimpleSchema({
	name: {
		type: String,
		optional: true,
	},

	birthday: {
		type: Date,
		optional: true,
	},

	biography: {
		type: String,
		optional: true,
	},

	publicEmailAddress: {
		type: String,
		optional: true,
	},
	academiaEdu: {
		type: String,
		optional: true,
	},
	twitter: {
		type: String,
		optional: true,
	},
	facebook: {
		type: String,
		optional: true,
	},
	google: {
		type: String,
		optional: true,
	},
	avatarUrl: {
		type: String,
		optional: true,
	},
	location: {
		type: String,
		optional: true,
	},
	country: {
		type: String,
		optional: true,
	},
});

Schemas.User = new SimpleSchema({
	_id: {
		type: String,
	},
	username: {
		type: String,
		optional: true,
	},
	isAnnotator: {
		type: Boolean,
		optional: true,
	},
	emails: {
		type: [Object],
		optional: true,
	},
	'emails.$.address': {
		type: String,
		regEx: SimpleSchema.RegEx.Email,
	},
	'emails.$.verified': {
		type: Boolean,
	},
	profile: {
		type: Schemas.UserProfile,
		optional: true,
	},
	services: {
		type: Object,
		optional: true,
		blackbox: true,
	},
	roles: {
		type: [String],
		blackbox: true,
		optional: true,
	},
	canEditCommenters: {
		type: [String],
		optional: true,
	},
	bookmarks: {
		type: Array,
		optional: true,
	},
	'bookmarks.$': {
		type: Object,
		optional: true,
		blackbox: true,
	},
	canAnnotateBooks: {
		type: Array,
		optional: true,
	},
	'canAnnotateBooks.$': {
		type: String,
		optional: true,
	},
	highlightingPreference: {
		type: Boolean,
		optional: true,
	},
	createdAt: {
		type: Date,
		optional: true,
	},
	createdBy: {
		type: String,
		optional: true,
	},
	updatedAt: {
		type: Date,
		optional: true,
	},
	updatedBy: {
		type: String,
		optional: true,
	},
});

Meteor.users.attachSchema(Schemas.User);

Meteor.users.attachBehaviour('timestampable', {
	createdAt: 'created',
	createdBy: 'createdBy',
	updatedAt: 'updated',
	updatedBy: 'updatedBy',
});

Meteor.users.allow({
	update: (userId) => {
		if (Meteor.userId() === userId) {
			return true;
		}
		return false;
	},
});

this.StarterSchemas = Schemas;
