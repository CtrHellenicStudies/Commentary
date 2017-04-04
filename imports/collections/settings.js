import Tenants from '/imports/collections/tenants';

const Settings = new Meteor.Collection('settings');

Settings.schema = new SimpleSchema({
	name: {
		type: String,
	},
	domain: {
		type: String,
	},
	title: {
		type: String,
	},
	subtitle: {
		type: String,
		optional: true,
	},
	footer: {
		type: String,
	},
	emails: {
		type: Object,
	},
	'emails.from': {
		type: String,
	},
	'emails.contact': {
		type: String,
	},
	tenantId: {
		type: String,
	},

	webhooksToken: {
		optional: true,
		type: String,
	},

	homepageCover: {
		optional: true,
		type: afSlingshot.fileSchema,
	},

	homepageIntroduction: {
		optional: true,
		type: [Object],
	},

	homepageIntroductionImage: {
		optional: true,
		type: afSlingshot.fileSchema,
	},

	homepageIntroductionImageCaption: {
		optional: true,
		type: String,
	},

	'introBlocks.$.title': {
		optional: true,
		type: String,
	},

	'introBlocks.$.text': {
		optional: true,
		type: String,
	},

	'introBlocks.$.linkURL': {
		optional: true,
		type: String,
	},

	'introBlocks.$.linkText': {
		optional: true,
		type: String,
	},

});

Settings.attachSchema(Settings.schema);
Settings.friendlySlugs('name');
Settings.attachBehaviour('timestampable');

export default Settings;
