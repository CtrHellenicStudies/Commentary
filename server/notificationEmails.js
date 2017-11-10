/**
 * Send batched notification emails 
 */

import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { SyncedCron } from 'meteor/percolate:synced-cron';

function generateEmailDatas(user){
	let username = user.profile.name,
	numberOfNotifications = user.subscriptions.notifications.length,
	ret = {};
	ret.from = 'no-reply@ahcip.chs.harvard.edu';
	ret.to = user.emails[0].address;
	ret.subject = 'Notifications';
	ret.text = generateNotificationText(numberOfNotifications, username);
	return ret;
}
function generateNotificationText(numberOfNotifications, username){
	let text = `
	Dear ${username},

	You have ${numberOfNotifications} ${numberOfNotifications > 1 ? 'notifications' : 'notification'}.
	Please review your notifications at ahcip.chs.harvard.edu.

	You can change how often you receive these emails in your account settings.
	`;
	return text;
}
export function sendBatchNotificationEmails(routine) {
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
		console.log(generateEmailDatas(user));
		Email.send(generateEmailDatas(user));
	}
);

}
export function sendBatchNotificationEmailsForComment(commentId, userId) {
	console.log(commentId);
	const subscribedUsers = Meteor.users.find(
		{ $and:
			[
				{"subscriptions.notifications": {
					$elemMatch: {
						commentId: commentId
					}
				}
				},
				{emails: {$exists: true}},
				{_id: {$ne: userId}}
			]
		}
	).fetch();
	console.log(subscribedUsers);
	subscribedUsers.forEach(user => {
		console.log(generateEmailDatas(user));
		Email.send(generateEmailDatas(user));
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
