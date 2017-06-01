import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

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
		commenters: React.PropTypes.array,
	}

	render() {
		const { comment, commenters, tenant, settings } = this.props;

		const styles = {
			commenterAvatar: {
				backgroundSize: 'cover',
			}
		};
		let title = '';
		let excerpt = '';
		let byline = '';
		let avatarUrl = '';
		let commentUrl = `/commentary?_id=${comment._id}`;

		const mostRecentRevision = comment.revisions[comment.revisions.length - 1];

		title = mostRecentRevision.title;
		if (mostRecentRevision.text) {
			excerpt = Utils.trunc(mostRecentRevision.text.replace(/(<([^>]+)>)/ig, ''), 120);
		}

		if (commenters && commenters.length) {
			byline = `By ${commenters[0].name} ${moment(comment.updated).fromNow()}`;
			avatarUrl = commenters[0].avatar.src;
		}

		if (settings) {
			commentUrl = `https://${settings.domain}${commentUrl}`;
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
	const tenantsHandle = Meteor.subscribe('tenants');
	const commenterIds = [];
	let commenters = [];
	let tenant;
	let settings;

	if (comment) {
		const settingsHandle = Meteor.subscribe('settings.tenant', comment.tenantId);

		comment.commenters.forEach((commenter) => {
			commenterIds.push(commenter._id);
		});

		commenters = Commenters.find({ _id: { $in: commenterIds } }).fetch();
		tenant = Tenants.findOne({ _id: comment.tenantId });
		settings = Settings.findOne({ tenantId: comment.tenantId });
	}

	return {
		commenters,
		tenant,
		settings,
	};
}, RecentActivityTeaser);

export default RecentActivityTeaserContainer;
