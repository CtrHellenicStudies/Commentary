import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import Books from '/imports/api/collections/books';
import Commenters from '/imports/api/collections/commenters';
import Tenants from '/imports/api/collections/tenants';
import Settings from '/imports/api/collections/settings';
import Utils from '/imports/lib/utils';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';

class RecentActivityTeaser extends React.Component {
	static propTypes = {
		comment: React.PropTypes.object.isRequired,
		tenant: React.PropTypes.object,
		settings: React.PropTypes.object,
		book: React.PropTypes.object,
		commenters: React.PropTypes.array,
		users: React.PropTypes.array,
	}

	render() {
		const { comment, commenters, users, tenant, settings, book } = this.props;

		const styles = {
			commenterAvatar: {
				backgroundSize: 'cover',
			}
		};
		let title = '';
		let excerpt = '';
		let byline = '';
		let avatarUrl = '';
		let username = '';
		let user;
		let commenter;
		let commentUrl = `/commentary?_id=${comment._id}`;

		const mostRecentRevision = comment.revisions[comment.revisions.length - 1];

		title = mostRecentRevision.title;
		if (mostRecentRevision.text) {
			excerpt = Utils.trunc(mostRecentRevision.text.replace(/(<([^>]+)>)/ig, ''), 120);
		}

		if (commenters && commenters.length) {
			// TODO: support multiple user annotations
			commenter = commenters[0];

			byline = `By ${commenter.name} ${moment(comment.updated).fromNow()}`;
			if ('avatar' in commenter) {
				avatarUrl = commenter.avatar.src;
			}
		}

		if (settings) {
			commentUrl = `https://${settings.domain}${commentUrl}`;
		}


		if (comment.isAnnotation) {
			// TODO: support multiple user annotations
			user = users[0];

			if (!user) {
				return null;
			}

			if ('profile' in user && user.profile.name) {
				username = user.profile.name;
			} else if (user.username) {
				username = user.username;
			} else if (user.emails.length) {
				username = user.emails[0].address;
			}

			byline = `By ${username} ${moment(comment.updated).fromNow()}`;
			avatarUrl = user.avatarUrl;

			if (book) {
				title = `Annotation on ${book.title}`;
				book.chapters.forEach((chapter) => {
					if (chapter.url === comment.bookChapterUrl) {
						title = `${title}: ${chapter.title}`;
					}
				});
			}

			commentUrl = `http://chs-dev.orphe.us${comment.bookChapterUrl}?paragraph=${comment.paragraphN}`;
		}

		return (
			<div className="recentActivityTeaser clearfix">
				<div className="recentActivityTeaserLeft">
					<AvatarIcon avatar={avatarUrl} />
				</div>

				<div className="recentActivityTeaserRight">
					<a href={commentUrl} target="_blank" rel="noopener noreferrer">
						<h4 className="recentActivityTitle">
							{title}
						</h4>
					</a>
					<span className="recentActivityByline">
						{byline}
					</span>
					<p className="recentActivityExcerpt">
						{excerpt}
					</p>
				</div>
			</div>
		);
	}
}

const RecentActivityTeaserContainer = createContainer(({ comment }) => {

	const handle = Meteor.subscribe('commenters.all');
	const booksHandle = Meteor.subscribe('books');
	const tenantsHandle = Meteor.subscribe('tenants');
	const commenterIds = [];
	let userIds = [];
	let commenters = [];
	let users = [];
	let tenant;
	let book;
	let settings;

	if (comment) {
		const settingsHandle = Meteor.subscribe('settings.tenant', comment.tenantId);

		if ('commenters' in comment) {
			comment.commenters.forEach((commenter) => {
				commenterIds.push(commenter._id);
			});
		}

		if (comment.users) {
			userIds = comment.users;
		}

		commenters = Commenters.find({ _id: { $in: commenterIds } }).fetch();
		users = Meteor.users.find({ _id: { $in: userIds } }).fetch();
		tenant = Tenants.findOne({ _id: comment.tenantId });
		book = Books.findOne({'chapters.url': comment.bookChapterUrl});
		settings = Settings.findOne({ tenantId: comment.tenantId });
	}

	return {
		commenters,
		users,
		tenant,
		book,
		settings,
	};
}, RecentActivityTeaser);

export default RecentActivityTeaserContainer;
