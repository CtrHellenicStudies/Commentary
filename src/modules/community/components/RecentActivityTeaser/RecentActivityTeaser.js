import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';

// lib
import Utils from '../../../../lib/utils';

// components
import AvatarIcon from '../../../users/components/AvatarIcon';

import './RecentActivityTeaser.css';


class RecentActivityTeaser extends React.Component {
	static propTypes = {
		comment: PropTypes.object.isRequired,
		tenant: PropTypes.object,
		settings: PropTypes.object,
		book: PropTypes.object,
		commenters: PropTypes.array,
		users: PropTypes.array,
	}

	render() {
		const { comment, users, settings, book } = this.props;

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

		const commenters = comment.commenters;
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

			commentUrl = `http://chs.harvard.edu/${comment.bookChapterUrl}?paragraph=${comment.paragraphN}`;
		}

		return (
			<div className="recentActivityTeaser clearfix">
				<div className="recentActivityTeaserLeft">
					<AvatarIcon avatar={avatarUrl} />
				</div>

				<div className="recentActivityTeaserRight">
					<Link to={commentUrl} target="_blank" rel="noopener noreferrer">
						<h4 className="recentActivityTitle">
							{title}
						</h4>
					</Link>
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

export default RecentActivityTeaser;
