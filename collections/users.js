Schemas.UserProfile = new SimpleSchema({
	name: {
		type: String,
		optional: true,
	},

	tenantId: {
		type: String,
		label: 'Tenant',
		optional: true,
		autoform: {
			afFieldInput: {
				type: 'select',
				options: () => {
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

	birthday: {
		type: Date,
		optional: true,
	},
	biography: {
		type: String,
		optional: true,
		autoform: {
			rows: 4,
		},
	},
	publicEmailAdress: {
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
		autoform: {
			type: 'map',
			geolocation: true,
			searchBox: true,
			autolocate: true,
		},
	},
	country: {
		type: String,
		label: 'Nationality',
		allowedValues: ['Select Country', 'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola',
			'Anguilla', 'Antigua & Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria',
			'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
			'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia & Herzegovina', 'Botswana',
			'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
			'Cambodia', 'Cameroon', 'Cape Verde', 'Cayman Islands', 'Chad', 'Chile', 'China',
			'Colombia', 'Congo', 'Cook Islands', 'Costa Rica', 'Cote D Ivoire', 'Croatia',
			'Cruise Ship', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
			'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Estonia',
			'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France',
			'French Polynesia', 'French West Indies', 'Gabon', 'Gambia', 'Georgia', 'Germany',
			'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guam', 'Guatemala', 'Guernsey',
			'Guinea', 'Guinea Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary',
			'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel',
			'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait',
			'Kyrgyz Republic', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
			'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi',
			'Malaysia', 'Maldives', 'Mali', 'Malta', 'Mauritania', 'Mauritius', 'Mexico', 'Moldova',
			'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia',
			'Nepal', 'Netherlands', 'Netherlands Antilles', 'New Caledonia', 'New Zealand',
			'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama',
			'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
			'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda',
			'Saint Pierre & Miquelon', 'Samoa', 'San Marino', 'Satellite', 'Saudi Arabia', 'Senegal',
			'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
			'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'St Kitts & Nevis', 'St Lucia',
			'St Vincent', 'St. Lucia', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland',
			'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', "Timor L'Este", 'Togo', 'Tonga',
			'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks & Caicos', 'Uganda',
			'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
			'Uzbekistan', 'Venezuela', 'Vietnam', 'Virgin Islands (US)', 'Yemen', 'Zambia', 'Zimbabwe'],
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
		autoValue: function () {
			if (this.isInsert) {
				return false;
			}
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
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
	commenterId: {
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
