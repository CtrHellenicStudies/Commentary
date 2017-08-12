import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { ObjectID } from 'bson';

import Utils from '/imports/lib/utils';
import Config from '/imports/lib/_config/_config.js';

import Comments from '/imports/api/collections/comments';
import DiscussionComments from '/imports/api/collections/discussionComments';

import { sendDiscussionCommentInsertEmail, sendDiscussionCommentRejectEmail, sendDiscussionCommentPublishEmail } from './emails';


const deleteDiscussionComments = (token, _id) => {
	check(token, String);
	check(_id, String);

	if (!Meteor.users.findOne({
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
};

function insertDiscussionComment(discussionCommentCandidate) {
	check(discussionCommentCandidate, {
		content: String,
		tenantId: String,
		commentId: String,
	});
	const discussionComment = discussionCommentCandidate;

	// Make sure the user is logged in before inserting
	if (!Meteor.user()) {
		throw new Meteor.Error('not-authorized');
	}

	discussionComment.userId = Meteor.userId();
	discussionComment.votes = 1;
	discussionComment.voters = [Meteor.userId()];
	discussionComment.status = 'pending';

	check(discussionComment.content, String);
	check(discussionComment.votes, Number);
	check(discussionComment.commentId, String);

	// check if discussion comments for this comment have not been disabled:
	const comment = Comments.findOne({_id: discussionComment.commentId});
	if (comment.discussionCommentsDisabled) throw new Meteor.Error('insert denied - discussionCommentsDisabled');

	try {
		DiscussionComments.insert(discussionComment);
	} catch (err) {
		throw new Meteor.Error(err);
	}

	sendDiscussionCommentInsertEmail(discussionComment);
}

function updateDiscussionComment(discussionCommentId, discussionCommentData) {
	check(discussionCommentId, String);
	check(discussionCommentData, {
		tenantId: String,
		commentId: String,
		content: String,
	});

	if (!Meteor.userId()) throw new Meteor.Error('not-authorized');

	const discussionComment = DiscussionComments.findOne({
		_id: discussionCommentId,
	});

	// Make sure the user has auth to edit
	if (Meteor.userId() !== discussionComment.userId) {
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
}

const discussionCommentsUpdate = (token, discussionCommentId, discussionCommentData) => {
	check(token, String);
	check(discussionCommentId, String);
	check(discussionCommentData, {
		status: String,
	});

	if (!Meteor.users.findOne({
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
	 * If status update was approval or trashed, send email notification that discussion
	 * comment was approved
	 */
	const discussionComment = DiscussionComments.findOne(discussionCommentId);
	const user = Meteor.users.find({ _id: discussionComment.userId });
	const avatar = user.profile && user.profile.url ? user.profile.url : '/images/default_user.jpg';

	const notification = {
		message: discussionCommentData.status === 'publish' ? 'Your comment has been approved.' : 'Your comment has been rejected',
		avatar: {src: avatar},
		created: new Date(),
		_id: new ObjectID().toString(),
		slug: discussionComment.commentId
	};

	if (discussionCommentData.status === 'publish') {
		sendDiscussionCommentPublishEmail(discussionCommentId);
	} else if (discussionCommentData.status === 'trash') {
		sendDiscussionCommentRejectEmail(discussionCommentId);
	}
	
	const updateUser = Meteor.users.update({_id: discussionComment.userId}, {$push: {'subscriptions.notifications': notification}});
};

function upvoteDiscussionComment(discussionCommentId) {
	check(discussionCommentId, String);
	const discussionComment = DiscussionComments.findOne(discussionCommentId);

	if (!Meteor.userId()) throw new Meteor.Error('not-authorized');

	// Make sure the user has not already upvoted
	if (discussionComment.voters.indexOf(Meteor.userId()) >= 0) {
		throw new Meteor.Error('not-authorized');
	}

	try {
		DiscussionComments.update({
			_id: discussionCommentId,
		}, {
			$push: { voters: Meteor.userId() },
			$inc: { votes: 1 },
		});
	} catch (err) {
		throw new Meteor.Error(err);
	}
}

function reportDiscussionComment(discussionCommentId) {
	check(discussionCommentId, String);
	const discussionComment = DiscussionComments.findOne(discussionCommentId);
	const comment = Comments.findOne(discussionComment.commentId);

	if (!Meteor.userId()) throw new Meteor.Error('not-authorized');

	// Make sure the user has not already reported this comment
	if (
			'usersReported' in discussionComment
		&& discussionComment.usersReported.indexOf(Meteor.userId()) >= 0
	) {
		throw new Meteor.Error('not-authorized');
	}

	try {
		if ('usersReported' in discussionComment) {
			DiscussionComments.update({
				_id: discussionCommentId,
			}, {
				$push: { usersReported: Meteor.userId() },
				$inc: { reported: 1 },
			});
		} else {
			DiscussionComments.update({
				_id: discussionCommentId,
			}, {
				$set: {
					reported: 1,
					usersReported: [Meteor.userId()],
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
		${Config.title}
		`,
	});
}

function unreportDiscussionComment(discussionCommentId) {
	check(discussionCommentId, String);

	if (!Meteor.userId()) throw new Meteor.Error('not-authorized');

	const discussionComment = DiscussionComments.findOne(discussionCommentId);

	try {
		if ('usersReported' in discussionComment) {
			DiscussionComments.update({
				_id: discussionCommentId,
			}, {
				$pull: { usersReported: Meteor.userId() },
				$inc: { reported: -1 },
			});
		}
	} catch (err) {
		throw new Meteor.Error(err);
	}
}


Meteor.methods({
	'discussionComments.delete': deleteDiscussionComments,

	'discussionComments.insert': insertDiscussionComment,

	'discussionComments.update': updateDiscussionComment,

	'discussionComments.updateStatus': discussionCommentsUpdate,

	'discussionComments.upvote': upvoteDiscussionComment,

	'discussionComments.report': reportDiscussionComment,

	'discussionComments.unreport': unreportDiscussionComment,
});


export { deleteDiscussionComments, insertDiscussionComment, updateDiscussionComment, discussionCommentsUpdate, upvoteDiscussionComment, reportDiscussionComment, unreportDiscussionComment };
