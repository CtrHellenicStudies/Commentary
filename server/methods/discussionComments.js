import Comments from '/imports/api/collections/comments';
import DiscussionComments from '/imports/api/collections/discussionComments';

Meteor.methods({
	'discussionComments.delete': (token, _id) => {
		check(token, String);
		check(_id, String);

		const roles = ['editor', 'admin', 'commenter'];
		if ((
				!Meteor.userId()
				&& !Roles.userIsInRole(Meteor.user(), roles)
			)
			&& !Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})
		) {
			throw new Meteor.Error('discussionComment-delete', 'not-authorized');
		}

		try {
			DiscussionComments.remove({ _id });
		} catch (err) {
			throw new Meteor.Error('discussionComment-delete', err);
		}

		return _id;
	},

	'discussionComments.insert': function insertDiscussionComment(discussionCommentCandidate) {
		check(discussionCommentCandidate, {
			content: String,
			tenantId: String,
			commentId: String,
		});
		const discussionComment = discussionCommentCandidate;

		// Make sure the user is logged in before inserting
		if (!this.userId) {
			throw new Meteor.Error('not-authorized');
		}

		const currentUser = Meteor.users.findOne({ _id: this.userId });
		discussionComment.userId = currentUser._id;
		discussionComment.votes = 1;
		discussionComment.voters = [currentUser._id];
		discussionComment.status = 'pending';

		check(discussionComment.content, String);
		check(discussionComment.votes, Number);
		check(discussionComment.commentId, String);

		try {
			DiscussionComments.insert(discussionComment);
		} catch (err) {
			throw new Meteor.Error(err);
		}
	},

	'discussionComments.update': function updateDiscussionComment(discussionCommentId, discussionCommentData) {
		check(discussionCommentId, String);
		check(discussionCommentData, {
			tenantId: String,
			commentId: String,
			content: String,
		});

		const discussionComment = DiscussionComments.findOne({
			_id: discussionCommentId,
		});

		// Make sure the user has auth to edit
		if (this.userId !== discussionComment.userId) {
			throw new Meteor.Error('not-authorized');
		}

		try {
			DiscussionComments.update({
				_id: discussionComment._id,
			}, {
				$set: {
					content: discussionCommentData.content,
				},
			});
		} catch (err) {
			throw new Meteor.Error(err);
		}
	},

	'discussionComments.updateStatus': (token, discussionCommentId, discussionCommentData) => {
		check(token, String);
		check(discussionCommentId, String);
		check(discussionCommentData, {
			status: String,
		});

		const roles = ['admin'];
		if ((
				!Meteor.userId()
				&& !Roles.userIsInRole(Meteor.user(), roles)
			)
			&& !Meteor.users.findOne({
				roles: 'admin',
				'services.resume.loginTokens.hashedToken': Accounts._hashLoginToken(token),
			})
		) {
			throw new Meteor.Error('discussionComment-updateStatus', 'not-authorized');
		}

		/*
		 * Update the discussion comment
		 */
		try {
			DiscussionComments.update({
				_id: discussionCommentId,
			}, {
				$set: {
					status: discussionCommentData.status,
				},
			});
		} catch (err) {
			throw new Meteor.Error(err);
		}


		/*
		 * If status update was approval, send email notification that discussion
		 * comment was approved
		 */

		if (discussionCommentData.status === 'publish') {
			const discussionComment = DiscussionComments.findOne({ _id: discussionCommentId });
			const comment = Comments.findOne({ _id: discussionComment.commentId });
			const user = Meteor.users.findOne({ _id: discussionComment.userId });

			let userFullName = '';
			let userEmail;

			if ('name' in user.profile) {
				userFullName = user.profile.name;
			} else {
				userFullName = user.username;
			}

			const commentLink = `${Meteor.absoluteUrl()}commentary/?_id=${comment._id}`;
			let commentTitle = '';
			if (comment.revisions.length) {
				comment.revisions.sort(Utils.sortRevisions);
				commentTitle = comment.revisions[comment.revisions.length - 1].title;
			}


			Email.send({
				to: ['lukehollis@gmail.com'],
				from: Config.emails.from,
				subject: `Your comment has been approved at ${Config.name}`,
				html: `Dear ${userFullName},
				<br />
				<br />
				Your comment on ${commentTitle} has been approved! You may view the discussion by visiting the following link: <a href='${commentLink}'>${commentLink}</a>.
				<br />
				<br />
				Thank you for your submission!
				<br />
				<br />
				${Config.title}
				`,
			});
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
			throw new Meteor.Error(err);
		}
	},

	'discussionComments.report': function reportDiscussionComment(discussionCommentId) {
		check(discussionCommentId, String); this.unblock();
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
		const user = Meteor.users.findOne({ _id: discussionComment.userId });
		if ('name' in user.profile) {
			userFullName = user.profile.name;
		} else {
			userFullName = user.username;
		}
		const discussionCommentDate = discussionComment.updated || discussionComment.created;
		const lastUpdated = discussionCommentDate.toISOString().replace('T', ' ').substr(0, 19);
		const commentLink = `${Meteor.absoluteUrl()}commentary/?_id=${comment._id}`;

		/*
		 * Send email notification that a discussion comment was flagged
		 */
		Email.send({
			to: ['muellner@chs.harvard.edu', 'lhollis@chs.harvard.edu'],
			from: Config.emails.from,
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
			throw new Meteor.Error(err);
		}
	},
});
