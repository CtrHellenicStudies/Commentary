this.Settings = new Meteor.Collection('settings');

Schemas.Settings = new SimpleSchema({
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
});

Settings.attachSchema(Schemas.Settings);
Settings.friendlySlugs('name');
Settings.attachBehaviour('timestampable');
