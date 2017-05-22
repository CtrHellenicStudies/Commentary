import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

class RecentActivityTeaser extends React.Component {
	static propTypes = {
		comment: React.PropTypes.object.isRequired,
		commenter: React.PropTypes.object,
	}

	render() {
		const styles = {
			commenterAvatar: {
				backgroundSize: 'cover',
			}
		};
		let title = '';
		let excerpt = '';

		if (!commenter) {
			return null;
		}

		const mostRecentRevision = comment.revisions[comment.revision.length - 1];

		title = mostRecentRevision.title;
		excerpt = Utils.trunc(mostRecentRevision.content.replace(/(<([^>]+)>)/ig, ''), 120);


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

const RecentActivityTeaserContainer = createContainer(() => {
	let commenter;
	return {
		commenter,
	};
}, RecentActivityTeaser);

export default RecentActivityTeaserContainer;
