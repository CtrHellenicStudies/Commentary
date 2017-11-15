import Comments from '/imports/models/comments';

const commentsURNsFix = () => {
	const comments = Comments.find().fetch();
	comments.forEach((comment) => {
		let urn = comment.urn;
		urn = urn.replace('Commentary','Commentaries.AHCIP');
		try {
			Comments.update({
				_id: comment._id,
			}, {
				$set: {
					urn,
				},
			});
		} catch (err) {
			throw new Meteor.Error(`Error fixing comment.commentsURNsFix ${comment._id}: ${err}`);
		}
	});
	console.log(' -- method commentsURNsFix run completed');
};

export default commentsURNsFix;
