if ('smtp' in Meteor.settings) {
	process.env.MAIL_URL = Meteor.settings.smtp;
}
