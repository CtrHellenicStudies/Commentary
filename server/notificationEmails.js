import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { SyncedCron } from 'meteor/percolate:synced-cron';

function sendBatchNotificationEmails(routine) {
	const subscribedUsers = Meteor.users.find(
		{$and: 
		[
			{batchNotification: routine}, 
			{'subscriptions.notifications.0': {$exists: true}},
			{emails: {$exists: true}}
		]
		}
	).fetch();

	subscribedUsers.forEach(user => {
		const numberOfNotifications = user.subscriptions.notifications.length;
		
		let username = 'Commentary User';
		if (user.profile.name) {
			username = user.profile.name;
		} else if (user.username) {
			username = user.username;
		}

		const from = 'no-reply@ahcip.chs.harvard.edu';
		const to = user.emails[0].address;
		const subject = 'Notifications';
		const text = `
		Dear ${username},

		You have ${numberOfNotifications} ${numberOfNotifications > 1 ? 'notifications' : 'notification'}.
		Please review your notifications at ahcip.chs.harvard.edu.

		You can change how often you receive these emails in your account settings.
		`;

		Email.send({from, to, subject, text});
	}
);

}

SyncedCron.add({
	name: 'Send daily notification email',
	schedule: parser => parser.text('at 9:00am'),
	job: () => {
		sendBatchNotificationEmails('daily');
	}
});

SyncedCron.add({
	name: 'Send weekly notification email',
	schedule: parser => parser.text('at 9:00am on Monday'),
	job: () => {
		sendBatchNotificationEmails('weekly');
	}
});

SyncedCron.add({
	name: 'Send monthly notification email',
	schedule: parser => parser.text('on the first day of the month at 9:00am'),
	job: () => {
		sendBatchNotificationEmails('monthly');
	}
});
