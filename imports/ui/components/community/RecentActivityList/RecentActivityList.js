import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// api
import Comments from '/imports/api/collections/comments';

// components
import RecentActivityTeaser from '../RecentActivityTeaser';

class RecentActivityList extends React.Component {
	static propTypes = {
		comments: React.PropTypes.array,
	}

	render() {
		const { comments } = this.props;

		return (
			<div className="recentActivityList">
				{comments.map((comment, i) => (
					<RecentActivityTeaser
						key={i}
						comment={comment}
					/>
				))}
			</div>
		);
	}
}

const RecentActivityListContainer = createContainer(() => {
	let comments = [];
	const handle = Meteor.subscribe('comments.recent', 0, 12);
	comments = Comments.find().fetch();

	return {
		comments,
		ready: handle.ready(),
	};
}, RecentActivityList);

export default RecentActivityListContainer;
