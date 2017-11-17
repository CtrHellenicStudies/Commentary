import Comments from '/imports/models/comments';
import Tenants from '/imports/models/tenants';

const commentsURNsFix = () => {
	const comments = Comments.find().fetch();
	const tenants = Tenants.find().fetch();

	comments.forEach((comment) => {
		let urn = {};

		try {
			Comments.update({
				_id: comment._id,
			}, {
				$set: {
					urn
				},
			});
		} catch (err) {
			throw new Meteor.Error(`Error fixing comment.commentsURNsFix ${comment._id}: ${err}`);
		}
	});
	console.log(' -- method commentsURNsFix run completed');
};

export default commentsURNsFix;
