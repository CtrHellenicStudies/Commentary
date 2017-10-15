import { Meteor } from 'meteor/meteor';

/**
 * Global configuration settings for the application across tenants
 */
const Config = {
	name: 'Classical Commentaries',
	domain: 'ahcip.chs.harvard.edu',
	title: 'Classical Commentaries | Center for Hellenic Studies',
	logo: '/images/logo-tower.png',
	footer: () => {
		const copyright = `Copyright ${new Date().getFullYear()}, Center for Hellenic Studies`;
		return copyright;
	},
	emails: {
		from: 'no-reply@ahcip.chs.harvard.edu',
		contact: 'contact@ahcip.chs.harvard.edu',
	},
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

export default Config;
