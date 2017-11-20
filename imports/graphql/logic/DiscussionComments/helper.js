import Utils from '/imports/lib/utils';
import Config from '/imports/lib/_config/_config.js';


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
export { sendReportMessage };
