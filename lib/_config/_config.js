this.Config = {
	name: 'A Homer Commentary in Progress',
	domain: 'ahcip.archimedes.digital',
	title: () => {
		const title = `${this.Config.name} | Center for Hellenic Studies`;
		return title;
	},
	subtitle: '',
	logo: '/images/logo-tower.png',
	footer: () => {
		const copyright = `Copyright ${new Date().getFullYear()}, Center for Hellenic Studies`;
		return copyright;
	},
	emails: {
		from: () => `no-reply@${this.Config.domain}`,
		contact: () => `contact@${this.Config.domain}`,
	},
	username: false,
	defaultLanguage: 'en',
	dateFormat: 'D/M/YYYY',
	privacyUrl: `${Meteor.absoluteUrl()}/privacy`,
	termsUrl: `${Meteor.absoluteUrl()}/terms`,
	legal: {
		address: '',
		name: 'A Homer Commentary in Progress',
		url: Meteor.absoluteUrl(),
	},
	about: `${Meteor.absoluteUrl()}/about`,
	blog: `${Meteor.absoluteUrl()}`,
	homeRoute: '/',
	publicRoutes: ['home'],
	dashboardRoute: '/',
};
