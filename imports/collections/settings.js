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
	legal: {
		type: Object,
	},
	'legal.address': {
		type: String,
		optional: true,
	},
	'legal.name': {
		type: String,
		optional: true,
	},
	'legal.url': {
		type: String,
		autoValue() {
			if (this.isInsert) { return Meteor.absoluteUrl(); }
		},
	},
	tenantId: {
		type: String,
		label: 'Tenant',
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'select',
				options() {
					const tenants = [];
					_.map(Tenants.find().fetch(), (tenant) => {
						tenants.push({
							label: tenant.subdomain,
							value: tenant._id,
						});
					});
					return tenants;
				},
			},
		},
	},

	homepageCover: {
		optional: true,
		label: 'Homepage Cover Image',
		type: afSlingshot.fileSchema,
		autoform: {
		  type: 'slingshot',
			slingshot: {
				downloadUrl: (data) => {
					console.log(data);
				},
				directives: [{
					name: "uploads"
				}],
			},
		}
	},

	homepageIntroductionTitle: {
		optional: true,
		type: String,
	},

	homepageIntroductionImage: {
		optional: true,
		label: 'Homepage Introduction Image',
		type: afSlingshot.fileSchema,
		autoform: {
		  type: 'slingshot',
			slingshot: {
				downloadUrl: (data) => {
					console.log(data);
				},
				directives: [{
					name: "uploads"
				}],
			},
		}
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
