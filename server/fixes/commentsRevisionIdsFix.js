import Comments from '/imports/models/comments';

const commentsRevisionIdsFix = () => {
	const comments = Comments.find().fetch();
	comments.forEach((comment) => {
		const revisions = comment.revisions;

		revisions.forEach((revision) => {
			if (!revision._id) {
				const _id = new Meteor.Collection.ObjectID();
				revision._id = _id.valueOf();
			} else if (typeof revision._id === 'object') {
				revision._id = revision._id.valueOf();
			}
		});

		try {
			Comments.update({
				_id: comment._id,
			}, {
				$set: {
					revisions,
				},
			});
		} catch (err) {
			throw new Meteor.Error(`Error fixing comment.revisionIdsFix ${comment._id}: ${err}`);
		}
	});
	console.log(' -- method commentsRevisionIdsFix run completed');
};

Meteor.method('commentsRevisionIdsFix', () => {
	commentsRevisionIdsFix();
}, {
	url: 'fix/comments/revisionIds',
});
