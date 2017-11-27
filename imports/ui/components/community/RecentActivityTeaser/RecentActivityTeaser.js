import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { commentersQuery } from '/imports/graphql/methods/commenters';
import { booksQuery } from '/imports/graphql/methods/books';
import { tenantsQuery } from '/imports/graphql/methods/tenants';
import { compose } from 'react-apollo';
import { createContainer } from 'meteor/react-meteor-data';

import moment from 'moment';

import Books from '/imports/models/books';
import Commenters from '/imports/models/commenters';
import Tenants from '/imports/models/tenants';
import Settings from '/imports/models/settings';
import Utils from '/imports/lib/utils';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';
import { Link } from 'react-router-dom';

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

const RecentActivityTeaserContainer = createContainer(props => {

	const commenterIds = [];
	let userIds = [];
	let commenters = [];
	let users = [];
	let tenant;
	let book;
	let settings;

	if (props.comment) {
		const settingsHandle = Meteor.subscribe('settings.tenant', props.comment.tenantId);

		if (props.comment.commenters) {
			props.comment.commenters.forEach((commenter) => {
				commenterIds.push(commenter._id);
			});
		}

		if (props.comment.users) {
			userIds = props.comment.users;
		}
		if (Session.get('tenantId')) {
			props.commentersQuery.refetch({
				tenantId: Session.get('tenantId')
			});
			props.tenantsQuery.variables.tenantId = Session.get('tenantId');
		}
		commenters = currentCommenters = props.commentersQuery.loading ? [] : props.commentersQuery.commenters.filter(x =>
			commenterIds.find(y => y === x._id));
	
		users = Meteor.users.find({ _id: { $in: userIds } }).fetch();
		tenant = props.tenantsQuery.loading ? {} : props.tenantsQuery.tenants;
		book = props.booksQuery.loading ? {} : props.booksQuery.find(x => 
			x.chapters.url === props.comment.bookChapterUrl);
		settings = Settings.findOne({ tenantId: props.comment.tenantId });
	}

	return {
		commenters,
		users,
		tenant,
		book,
		settings,
	};
}, RecentActivityTeaser);

export default compose(commentersQuery, booksQuery, tenantsQuery)(RecentActivityTeaserContainer);
