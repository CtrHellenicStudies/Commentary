import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/percolate:synced-cron';

SyncedCron.add({
	name: 'Send daily notification email',
	schedule: parser => parser.text('at 9:00am'),
	job: () => {
		const subcribedUsers = Meteor.users.find(
			{$and: 
			[
				{batchNotification: 'daily'}, 
				{'subscriptions.notifications.0': {$exists: true}}
			]
			}
		);
		for (user of subscribedUsers) {

		}
	}
});

SyncedCron.add({
	name: 'Send weekly notification email',
	schedule: parser => parser.text('at 9:00am on Monday'),
	job: () => {
		const subcribedUsers = Meteor.users.find(
			{$and: 
			[
				{batchNotification: 'weekly'}, 
				{'subscriptions.notifications.0': {$exists: true}}
			]
			}
		);
		
	}
});

SyncedCron.add({
	name: 'Send monthly notification email',
	schedule: parser => parser.text('on the first day of the month at 9:00am'),
	job: () => {
		const subcribedUsers = Meteor.users.find(
			{$and: 
			[
				{batchNotification: 'monthly'}, 
				{'subscriptions.notifications.0': {$exists: true}}
			]
			}
		);
		
	}
});
