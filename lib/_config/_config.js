this.Config = {
	name: 'A Homer Commentary in Progress',
	title: function() {
		return "A Homer Commentary in Progress";
	},
	subtitle: function() {
		return "A Homer Commentary in Progress";
	},
	logo: function() {
		return '<b>' + this.name + '</b>';
	},
	footer: function() {
		return this.name + ' - Copyright ' + new Date().getFullYear();
	},
	emails: {
		from: 'no-reply@' + Meteor.absoluteUrl(),
		contact: 'contact' + Meteor.absoluteUrl()
	},
	username: false,
	defaultLanguage: 'en',
	dateFormat: 'D/M/YYYY',
	privacyUrl: 'http://ahcip.chs.harvard.edu/terms',
	termsUrl: 'http://ahcip.chs.harvard.edu/terms',
	legal: {
		address: '',
		name: 'A Homer Commentary in Progress',
		url: 'http://ahcip.chs.harvard.edu'
	},
	about: 'http://ahcip.chs.harvard.edu/about',
	blog: 'http://ahcip.chs.harvard.edu',
	socialMedia: {
		github: {
			url: 'https://github.com/orgs/CtrHellenicStudies/',
			icon: 'github'
		}
	},
	homeRoute: '/',
	publicRoutes: ['home'],
	dashboardRoute: '/'
};
