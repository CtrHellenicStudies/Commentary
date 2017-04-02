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

	homepageCover: {
		optional: true,
		type: afSlingshot.fileSchema,
	},

	homepageIntroductionTitle: {
		optional: true,
		type: String,
	},

	homepageIntroductionImage: {
		optional: true,
		type: afSlingshot.fileSchema,
	},

	homepageIntroductionImageCaption: {
		optional: true,
		type: String,
	},

	homepageIntroductionText: {
		optional: true,
		type: String,
	},

	homepageIntroductionLink: {
		optional: true,
		type: String,
	},

	homepageIntroductionLinkText: {
		optional: true,
		type: String,
	},

	webhooksToken: {
		optional: true,
		type: String,
	}
});

Settings.attachSchema(Settings.schema);
Settings.friendlySlugs('name');
Settings.attachBehaviour('timestampable');

export default Settings;
