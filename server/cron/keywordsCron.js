import { Meteor } from 'meteor/meteor';
import winston from 'winston';
import Comments from '/imports/models/comments';
import Keywords from '/imports/models/keywords';


/**
 * Cron function for keywords, updating counts and other metadata
 */
const keywordCron = () => {
	const comments = Comments.find().fetch();
	const keywords = [];

	let isInKeywords = false;


	comments.forEach((comment, commentIndex) => {
		if ('keywords' in comment) {
			comment.keywords.forEach((commentKeyword, commentKeywordIndex) => {
				isInKeywords = false;
				if (commentKeyword !== null) {
					keywords.forEach((keyword, keywordIndex) => {
						if (keyword.slug === commentKeyword.slug) {
							isInKeywords = true;
							keywords[keywordIndex].count++;
						}
					});

					if (!isInKeywords) {
						comments[commentIndex].keywords[commentKeywordIndex].count = 0;
						keywords.push(commentKeyword);
					}
				}
			});
		}
	});


	keywords.forEach((keyword) => {
		Keywords.update({ _id: keyword._id }, { $set: { count: keyword.count } });
	});

	winston.info(' -- Cron run complete: Keywords');
};

Meteor.method('keyword_cron', () => {
	keywordCron();
}, {
	url: 'tags/cron',
	getArgsFromRequest(request) {
		const content = request.body;
		return [content];
	},
});

export default keywordCron;
