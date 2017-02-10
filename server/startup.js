import '../imports/startup/server/register_api.js';


if ('smtp' in Meteor.settings) {
	process.env.MAIL_URL = Meteor.settings.smtp;
}
