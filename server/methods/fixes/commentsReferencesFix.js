import Comments from '/imports/collections/comments';

const commentsReferenceWorkFix = () => {
	const comments = Comments.find().fetch();
	comments.forEach((comment) => {
		if (comment.referenceId) {
			const referenceWorks = [comment.referenceId];
			try {
				Comments.update({
					_id: comment._id,
				}, {
					$set: {
						referenceWorks,
					},
					$unset: {
						referenceId: '',
					},
				});
			} catch (err) {
				throw new Meteor.Error(`Error fixing comment.referenceWorkId ${comment._id}.${comment.referenceId}: ${err}`);
			}
		}
	});

	console.log(' -- method commentsReferenceWorkFix run completed');
};

Meteor.startup(() => {
	commentsReferenceWorkFix();
});
