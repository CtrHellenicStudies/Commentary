import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import Commenters from '/imports/api/collections/commenters';
import Utils from '/imports/lib/utils';

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

		const mostRecentRevision = comment.revisions[comment.revisions.length - 1];

		title = mostRecentRevision.title;
		if (mostRecentRevision.content) {
			excerpt = Utils.trunc(mostRecentRevision.content.replace(/(<([^>]+)>)/ig, ''), 120);
		}


		return (
			<div className="recentActivityTeaser">
				<div
					className="commenterAvatar"
					style={styles.commenterAvatar}
				/>
				<h3 className="recentActivityTitle">
					{title}
				</h3>
				<p className="recentActivityExcerpt">
					{excerpt}
				</p>
			</div>
		);
	}
}

const RecentActivityTeaserContainer = createContainer(({ comment }) => {

	const handle = Meteor.subscribe('commenters', Session.get('tenantId'));
	const commenters = Commenters.find().fetch();

	comment.commenters.forEach((commenter) => {
		commenters.forEach((_commenter) => {
			if (commenter._id === _commenter._id) {
				commenters.push(commenter);
			}
		});
	});

	return {
		commenters,
	};
}, RecentActivityTeaser);

export default RecentActivityTeaserContainer;
