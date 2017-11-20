import Utils from '/imports/lib/utils';
import Config from '/imports/lib/_config/_config.js';
import Meteor from 'meteor/meteor';
import DiscussionComments from '/imports/models/discussionComments';
import { sendBatchNotificationEmailsForComment } from '/server/notificationEmails';


import { sendDiscussionCommentRejectEmail, sendDiscussionCommentPublishEmail } from './emails';



/**
 * Send report message to administrator
 * @param {object} comment - comment under which discussionComment is reported
 * @param {*} discussionComment - reported discussionComment
 */
function sendReportMessage(comment, discussionComment) {
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
	
export { sendReportMessage };
