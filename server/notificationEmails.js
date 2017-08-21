import { Meteor } from 'meteor/meteor';

SyncedCron.add({
	name: 'Send daily notification email',
	schedule: parser => parser.text('at 9:00am'),
	job: () => {
		
	}
});

SyncedCron.add({
	name: 'Send weekly notification email',
	schedule: parser => parser.text('every Monday at 9:00am'),
	job: () => {

	}
});

SyncedCron.add({
	name: 'Send monthly notification email',
	schedule: parser => parser.text('on the first day of the month'),
	job: () => {
		
	}
});
