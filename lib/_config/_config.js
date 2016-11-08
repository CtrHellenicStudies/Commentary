this.Config = {
	name: 'A Homer Commentary in Progress',
	title: () => {
		const title = this.Config.name;
		return title;
	},
	subtitle: '',
	logo: '/images/logo.png',
	footer: () => {
		const copyright = `${this.name} - Copyright ${new Date().getFullYear()}`;
		return copyright;
	},
	emails: {
		from: `no-reply@${Meteor.absoluteUrl()}`,
		contact: `contact@${Meteor.absoluteUrl()}`,
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
