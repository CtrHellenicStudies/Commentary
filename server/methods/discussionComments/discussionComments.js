import Utils from '/imports/lib/utils';
import Config from '/imports/lib/_config/_config.js';

import Comments from '/imports/models/comments';
import DiscussionComments from '/imports/models/discussionComments';

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { ObjectID } from 'bson';
import { sendBatchNotificationEmailsForComment } from '../../notificationEmails';


import { sendDiscussionCommentInsertEmail, sendDiscussionCommentRejectEmail, sendDiscussionCommentPublishEmail } from './emails';


/**
 * Discussion Comment methods - either replaced or to be replaced with the graphql api
 */
function insertDiscussionComment(discussionCommentCandidate) {
	check(discussionCommentCandidate, {
		content: String,
		tenantId: String,
		commentId: String,
	});
	const discussionComment = discussionCommentCandidate;
	const commentsInDiscussion = DiscussionComments.find({commentId: discussionComment.commentId}).fetch();
	const notification = {
		created: new Date(),
		_id: new ObjectID().toString(),
		commentId: discussionComment.commentId
	};
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
function notifyAfterPublishRejection(id, status) {

	const discussionComment = DiscussionComments.findOne(id);
	const discussionComments = {};
	const user = Meteor.users.findOne({ _id: discussionComment.userId });
	const avatar = user.profile && user.profile.url ? user.profile.url : '/images/default_user.jpg';
	const discussionCommentsArray = [];

	const notification = {
		message: status === 'publish' ? 'Your comment has been approved.' : 'Your comment has been rejected',
		avatar: {src: avatar},
		created: new Date(),
		_id: new ObjectID().toString(),
		slug: discussionComment.commentId
	};

	if (status === 'publish') {
		sendDiscussionCommentPublishEmail(id);
		DiscussionComments.find().map((disscuss) => {
			if (disscuss.commentId === discussionComment.commentId && disscuss.userId !== user._id) {
				discussionComments[disscuss.userId] = true;
			}
		});
		for (const [key, value] of Object.entries(discussionComments)) {
			discussionCommentsArray.push(key);
		}
		Meteor.users.update({ 
			_id: {$in: discussionCommentsArray}
		}, {
			$push: {'subscriptions.notifications': notification
			}
		}, function sendNotificationEmail() {
			sendBatchNotificationEmailsForComment(discussionComment.commentId, user._id);
		});
	} else if (status === 'trash') {
		console.log('removed!');
		sendDiscussionCommentRejectEmail(discussionCommentId);
	}

	const updateUser = Meteor.users.update({_id: discussionComment.userId}, {$push: {'subscriptions.notifications': notification}});

}
function sendNotification(configurationObj) {
	console.log(configurationObj.to);
	Email.send({
		to: 'aniutka.pop@gmail.com',
		from: Config.emails.from,
		subject: 'Answer to your comment',
		html: configurationObj.text
	});

}
DiscussionComments.find().observeChanges({
	changed: function changed(id, fields) {
		if (!fields.status)			{ return; }
		notifyAfterPublishRejection(id, fields.status);
	}
});

Meteor.methods({

	'discussionComments.insert': insertDiscussionComment,

});


export { insertDiscussionComment };
