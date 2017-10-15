// api:
import Comments, { getURN } from '/imports/models/comments';

const commentsGenerateURNs = (regenerate = false) => {
	// set regenerate flag to true, to recreate all urn's for all comments

	Comments.find().forEach((comment) => {

		if (regenerate || !comment.urn) {

			console.info(`Updating comment's URN with _id: ${comment._id}`);

			try {
				console.info(`to ${getURN(comment)}`);
			} catch (err) {
				console.error('failed to run getURN method');
				console.error(err);
			}

			try {
				const success = Comments.update({_id: comment._id}, {$set: {urn: getURN(comment)}});
				if (!success) console.error(`Comment with _id ${comment._id} not updated!`);
			} catch (err) {
				console.error(err);
			}
		}
	});
};

/*
Meteor.method('commentsGenerateURNs', () => {
	commentsGenerateURNs(true);
}, {
	url: 'fix/comments/urns',
});
*/

export default commentsGenerateURNs;
