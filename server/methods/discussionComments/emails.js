import Config from '/imports/lib/_config/_config';

// lib:
import Utils from '/imports/lib/utils';

// models:
import Comments from '/imports/models/comments';
import DiscussionComments from '/imports/models/discussionComments';

// helpers
import { sortRevisions } from '/imports/ui/components/commentary/comments/helpers';


function getEmailHeader(user) {
	let userFullName = '';
	if (user.profile && 'name' in user.profile) {
		userFullName = user.profile.name;
	} else {
		userFullName = user.username;
	}
	return `
		Dear ${userFullName},
		<br />
		<br />
		<br />
	`;
}

const emailFooter = `
	<br />
	<br />
	<br />
	Best wishes,
	<br />
	<br />
	L. Muellner
	<br />
	Director for IT and Publications
	<br />
	Center for Hellenic Studies
	<br />
	3100 Whitehaven St., N.W.
	<br />
	Washington, DC 20008
`;

function sendDiscussionCommentInsertEmail(discussionComment) {
	const user = Meteor.users.findOne({ _id: discussionComment.userId });

	Email.send({
		to: [user.emails[0].address],
		from: Config.emails.from,
		subject: `Thank you for posting a comment at ${Config.name}`,
		html: `
		${getEmailHeader(user)}
		The comment that you submitted on ${moment().format('MM-DD-YYYY')} to A Homer Commentary in Progress (AHCIP) for posting will be reviewed by a moderator before it is made public. It is our goal to review and post your comment within a day or two.
		<br />
		<br />
		For your information, the Center for Hellenic Studies (CHS), which publishes AHCIP, reserves the right to review comments and silently correct obvious typographic errors and misspellings before making them public. If there is an error whose correction is unclear, we will contact you.
		<br />
		<br />
		CHS also reserves the right to review comments for relevance as well as civility and collegiality. It will either suggest changes or reject comments that are off-topic or inappropriate in tone. If an individual persists in uncollegial or inappropriate responses after being requested to avoid them or after having a post rejected, the CHS reserves the right to prevent that person from continuing to post comments to AHCIP.
		<br />
		<br />
		Lastly, it is the policy of CHS not to remove or revise any response to a comment once it has been both made public and responded to by another responder or the commenter. We do this in order to maintain the logic of the discussion.
		<br />
		Our policies are intended to make AHCIP a safe and welcoming environment in which civil conversations can take place and agreements as well as disagreements can be expressed in a constructive, positive way.
		${emailFooter}`,
	});
}

function sendDiscussionCommentRejectEmail(discussionCommentId) {
	const discussionComment = DiscussionComments.findOne({ _id: discussionCommentId });
	const user = Meteor.users.findOne({ _id: discussionComment.userId });

	Email.send({
		to: [user.emails[0].address],
		from: Config.emails.from,
		subject: `Your comment has been rejected at ${Config.name}`,
		html: `
		${getEmailHeader(user)}
		Unfortunately, the moderator considers the comment that you posted on ${moment().format('MM-DD-YYYY')} to be inappropriate or insufficiently civil to the community of researchers and students who are working on AHCIP.
		<br />
		<br />
		We would appreciate your respecting this decision and taking to heart its purpose. If you wish to submit a revised version of your response, please do so.
		${emailFooter}`,
	});
}

function sendDiscussionCommentPublishEmail(discussionCommentId) {
	const discussionComment = DiscussionComments.findOne({ _id: discussionCommentId });
	const comment = Comments.findOne({ _id: discussionComment.commentId });
	const user = Meteor.users.findOne({ _id: discussionComment.userId });
	const commentLink = `${Meteor.absoluteUrl()}commentary/?_id=${comment._id}`;

	let commentTitle = '';
	if (comment.revisions.length) {
		const revisions = comment.revisions;
		commentTitle = revisions[0].title;
	}

	let help = {
		to: [user.emails[0].address],
		from: Config.emails.from,
		subject: `Your comment has been published at ${Config.name}`,
		html: `
		${getEmailHeader(user)}
		Your comment on ${commentTitle} has been approved! You may view the discussion by visiting the following link: <a href='${commentLink}'>${commentLink}</a>.
		${emailFooter}`,
	};
	//Email.send(help);
}

export { sendDiscussionCommentInsertEmail, sendDiscussionCommentRejectEmail, sendDiscussionCommentPublishEmail };
