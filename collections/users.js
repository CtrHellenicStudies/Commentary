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
		autoform: {
			rows: 4,
		},
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
	username: {
		type: String,
		regEx: /^[a-z0-9A-Z_]{3,15}$/,
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
	created: {
		type: Date,
		optional: true,
		autoValue() {
			if (this.isInsert) {
				return new Date();
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
				return new Date();
			}
		},
		autoform: {
			type: 'hidden',
			label: false,
		},
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
		type: String,
		optional: true,
	},
	bookmarks: {
		type: [String],
		optional: true,
	},

	avatar: {
		type: Object,
		optional: true,
	},
	'avatar._id': {
		type: String,
	},
	'avatar.type': {
		type: String,
	},
	'avatar.url': {
		type: String,
	},
});

Meteor.users.attachSchema(Schemas.User);

this.StarterSchemas = Schemas;
