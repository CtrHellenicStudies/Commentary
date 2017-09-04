import winston from 'winston';
import { Meteor } from 'meteor/meteor';

// models
import Comments from '/imports/models/comments';

/*
 * revisionsTimestampFix:
 *
 * - ensure all revisions have created timestamp, if necessary back-dated to the
 *   time of the original reference work date
 *
 */
const revisionsTimestampFix = () => {
	const comments = Comments.find();

	comments.forEach(comment => {
		const revisions = comment.revisions;
		let createdPropertyAdded = false;

		revisions.forEach(revision => {

			// If the revision does not have a created property
			if (typeof revision.created === 'undefined' || !revision.created) {

				// Check the originalDate, updated, and then comment updated/created to
				// set the created property for the revision
				if (typeof revision.originalDate !== 'undefined' && revision.originalDate) {
					revision.created = revision.originalDate;
				} else if (typeof revision.updated !== 'undefined' && revision.updated) {
					revision.created = revision.updated;
				} else if (typeof comment.updated !== 'undefined' && comment.updated) {
					revision.created = comment.updated;
				} else {
					revision.created = comment.created;
				}

				// Flag which comments to update with the createdPropertyAdded variable
				createdPropertyAdded = true;
			}
		});

		// Update the comment revisions with the created properties added
		if (createdPropertyAdded) {
			Comments.update({
				_id: comment._id
			}, {
				$set: {
					revisions,
				},
			});
		}
	});

	winston.info('Revisions timestamp migration completed');
};

/*
 * Add method for deploying migration
 */
Meteor.method('revisionsTimestampFix', () => {
	revisionsTimestampFix(true);
}, {
	url: 'fix/revisions/timestamps',
});

export default revisionsTimestampFix;
