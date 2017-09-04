import winston from 'winston';
import { Meteor } from 'meteor/meteor';

// models
import Comments from '/imports/models/comments';

const revisionsTimestampFix = () => {
	const comments = Comments.find();

	comments.forEach(comment => {
		const revisions = comment.revisions;
		revisions.forEach(revision => {
			if (typeof revision.created === 'undefined' || !revision.created) {
				if (typeof revision.updated !== 'undefined' && revision.updated) {
					revision.created = revision.updated;
				} else if (typeof comment.updated !== 'undefined' && comment.updated) {
					revision.created = comment.updated;
				} else {
					revision.created = comment.created;
				}
			}
		});
		Comments.update({
			_id: comment._id
		}, {
			$set: {
				revisions,
			},
		});
	});

	winston.info('Revisions timestamp migration completed');
};

Meteor.method('revisionsTimestampFix', () => {
	revisionsTimestampFix(true);
}, {
	url: 'fix/revisions/timestamps',
});

export default revisionsTimestampFix;
