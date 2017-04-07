import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
	console.log('mail_URL', process.env.MAIL_URL);
	if ('smtp' in Meteor.settings.private) {
		process.env.MAIL_URL = Meteor.settings.private.smtp;
		console.log('mail_URL', process.env.MAIL_URL);

		/*
		Email.send({
			to: 'lukehollis@gmail.com',
			from: 'no-reply@ahcip.chs.harvard.edu',
			subject: 'testing',
			text: 'foobar'
		});
		*/
	}
}
