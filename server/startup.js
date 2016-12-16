import '../imports/startup/server/register_api.js';
import '../imports/avatar/server/avatar_server_startup.js';


if ('smtp' in Meteor.settings) {
	process.env.MAIL_URL = Meteor.settings.smtp;
}
