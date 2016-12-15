Meteor.method('cron', () => {
	Meteor.call('keyword_cron');
	Meteor.call('commenters_cron');
	Meteor.call('commentary_cron');
	console.log(' -- Cron run complete');
	return 1;
}, {
	url: 'cron',
	getArgsFromRequest(request) {
		// Sometime soon do validation here
		const content = request.body;

		return [content];
	},
});
