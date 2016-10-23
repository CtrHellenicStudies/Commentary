Meteor.methods({
	'discussionComments.insert': (discussionCommentCandidate) => {
		check(discussionCommentCandidate, Object);
		const discussionComment = discussionCommentCandidate;
		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const currentUser = Meteor.users.findOne({ _id: this.userId });
		discussionComment.user = currentUser;
		discussionComment.votes = 1;
		discussionComment.voters = [currentUser._id];

		// check(discussionComment.user, Schemas.User);
		check(discussionComment.content, String);
		check(discussionComment.votes, Number);
		check(discussionComment.commentId, String);

		console.log('Inserting new comment', discussionComment);
		try {
			DiscussionComments.insert(discussionComment);
		} catch (err) {
			console.log(err);
		}
	},

	'discussionComments.update': (discussionCommentData) => {
		check(discussionCommentData, Object);
		console.log('Discussion comment update:', discussionCommentData);

		const discussionComment = DiscussionComments.findOne({
			_id: discussionCommentData._id,
		});

		// Make sure the user has auth to edit
		if (this.userId !== discussionComment.user._id) {
			throw new Meteor.Error('not-authorized');
		}

		check(discussionCommentData.content, String);
		console.log('Updating comment', discussionComment);
		try {
			DiscussionComments.update({
				_id: discussionComment._id,
			}, {
				$set: {
					content: discussionCommentData.content,
				},
			});
		} catch (err) {
			console.log(err);
		}
	},

	'discussionComments.upvote': (discussionCommentId) => {
		check(discussionCommentId, Number);

		const discussionComment = DiscussionComments.findOne(discussionCommentId);

		// Make sure the user has not already upvoted
		if (discussionComment.voters.indexOf(this.userId) >= 0) {
			throw new Meteor.Error('not-authorized');
		}

		try {
			DiscussionComments.update({
				_id: discussionCommentId,
			}, {
				$push: { voters: this.userId },
				$inc: { votes: 1 },
			});
		} catch (err) {
			console.log(err);
		}
	},

});
