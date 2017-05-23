import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';

// api
import Comments from '/imports/api/collections/comments';

// components
import RecentActivityTeaser from '../RecentActivityTeaser';

class RecentActivityList extends React.Component {
	static propTypes = {
		comments: React.PropTypes.array,
		loadMore: React.PropTypes.func,
	}

	render() {
		const { comments, loadMore } = this.props;

		return (
			<div className="recentActivityList">
				{comments.map((comment, i) => (
					<RecentActivityTeaser
						key={i}
						comment={comment}
					/>
				))}
				<div className="loadMore">
					<RaisedButton
						onClick={loadMore}
						label="Load More"
						primary
					/>
				</div>
			</div>
		);
	}
}

const RecentActivityListContainer = createContainer(() => {
	let comments = [];
	const handle = Meteor.subscribe('comments.recent', 0, 12);
	comments = Comments.find({}, { sort: { updated: -1 } }).fetch();

	return {
		comments,
		ready: handle.ready(),
	};
}, RecentActivityList);

export default RecentActivityListContainer;
