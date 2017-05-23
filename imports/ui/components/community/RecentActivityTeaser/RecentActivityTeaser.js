import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import moment from 'moment';

import Commenters from '/imports/api/collections/commenters';
import Utils from '/imports/lib/utils';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';

class RecentActivityTeaser extends React.Component {
	static propTypes = {
		comment: React.PropTypes.object.isRequired,
		commenters: React.PropTypes.array,
	}

	render() {
		const { comment, commenters } = this.props;

		const styles = {
			commenterAvatar: {
				backgroundSize: 'cover',
			}
		};
		let title = '';
		let excerpt = '';
		let byline = '';
		let avatarUrl = '';

		const mostRecentRevision = comment.revisions[comment.revisions.length - 1];

		title = mostRecentRevision.title;
		if (mostRecentRevision.text) {
			excerpt = Utils.trunc(mostRecentRevision.text.replace(/(<([^>]+)>)/ig, ''), 120);
		}

		if (commenters && commenters.length) {
			byline = `By ${commenters[0].name} ${moment(comment.updated).fromNow()}`;
			avatarUrl = commenters[0].avatar.src;
		}

		return (
			<div className="recentActivityTeaser clearfix">
				<div className="recentActivityTeaserLeft">
					<AvatarIcon avatar={avatarUrl} />
				</div>

				<div className="recentActivityTeaserRight">
					<a href={`/commentary?_id=${comment._id}`}>
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
	const commenterIds = [];
	let commenters = [];

	if (comment) {
		comment.commenters.forEach((commenter) => {
			commenterIds.push(commenter._id);
		});

		commenters = Commenters.find({_id: { $in: commenterIds } }).fetch();
	}

	return {
		commenters,
	};
}, RecentActivityTeaser);

export default RecentActivityTeaserContainer;
