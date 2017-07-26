import { Meteor } from 'meteor/meteor';
import winston from 'winston';


const runCron = () => {
  winston.info('Running Cron Methods:');
	Meteor.call('keyword_cron');
	Meteor.call('commenters_cron');
	Meteor.call('commentary_cron');
  winston.info('Cron Complete');
}

Meteor.method('cron', () => {
	runCron();
}, {
	url: 'cron',
	getArgsFromRequest(request) {
		const content = request.body;
		return [content];
	},
});

export default runCron;
