import Comments from '/imports/collections/comments';
import DiscussionComments from '/imports/collections/discussionComments';

Meteor.methods({
	'discussionComments.insert': function insertDiscussionComment(discussionCommentCandidate) {
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

	'discussionComments.update': function updateDiscussionComment(discussionCommentData) {
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

	'discussionComments.upvote': function upvoteDiscussionComment(discussionCommentId) {
		check(discussionCommentId, String);

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

	'discussionComments.report': function reportDiscussionComment(discussionCommentId) {
		check(discussionCommentId, String);
		this.unblock();

		const discussionComment = DiscussionComments.findOne(discussionCommentId);
		const comment = Comments.findOne(discussionComment.commentId);

		// Make sure the user has not already reported this comment
		if (
				'usersReported' in discussionComment
			&& discussionComment.usersReported.indexOf(this.userId) >= 0
		) {
			throw new Meteor.Error('not-authorized');
		}

		try {
			if ('usersReported' in discussionComment) {
				DiscussionComments.update({
					_id: discussionCommentId,
				}, {
					$push: { usersReported: this.userId },
					$inc: { reported: 1 },
				});
			} else {
				DiscussionComments.update({
					_id: discussionCommentId,
				}, {
					$set: {
						reported: 1,
						usersReported: [this.userId],
					},
				});
			}
		} catch (err) {
			throw new Meteor.Error('flag-discussion-comment', err);
		}

		let commentTitle = '';
		if (comment.revisions.length) {
			comment.revisions.sort(Utils.sortRevisions);
			commentTitle = comment.revisions[comment.revisions.length - 1].title;
		}

		let userFullName = '';
		if ('name' in discussionComment.user.profile) {
			userFullName = discussionComment.user.profile.name;
		} else {
			userFullName = discussionComment.user.username;
		}
		const discussionCommentDate = discussionComment.updated || discussionComment.created;
		const lastUpdated = discussionCommentDate.toISOString().replace('T', ' ').substr(0, 19);
		const commentLink = `${Meteor.absoluteUrl()}commentary/?_id=${comment._id}`;

		/*
		 * Send email notification that a discussion comment was flagged
		 */
		Email.send({
			to: 'lukehollis@gmail.com',
			from: Config.emails.from(),
			subject: `User comment flagged on ${Config.name}`,
			html: `Dear Administrator,
			<br />
			<br />
			A user comment that was created for comment ${commentTitle} has been flagged as
			inappropriate by another user. Please review the discussion comment by
			${userFullName} that was last updated at ${lastUpdated} by visiting the following
			link: <a href='${commentLink}'>${commentLink}</a>.
			<br />
			<br />
			${Config.title()}
			`,
		});
	},

	'discussionComments.unreport': function unreportDiscussionComment(discussionCommentId) {
		check(discussionCommentId, String);
		this.unblock();

		const discussionComment = DiscussionComments.findOne(discussionCommentId);

		try {
			if ('usersReported' in discussionComment) {
				DiscussionComments.update({
					_id: discussionCommentId,
				}, {
					$pull: { usersReported: this.userId },
					$inc: { reported: -1 },
				});
			}
		} catch (err) {
			console.log(err);
		}
	},
});
