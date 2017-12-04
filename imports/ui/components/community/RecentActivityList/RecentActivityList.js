import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import { compose } from 'react-apollo';
import { commentsQuery } from '/imports/graphql/methods/comments';

// models
import Comments from '/imports/models/comments';

// components
import RecentActivityTeaser from '../RecentActivityTeaser';

class RecentActivityList extends React.Component {
	static propTypes = {
		comments: PropTypes.array,
		loadMore: PropTypes.func,
	}

	constructor(props) {
		super(props);
		this.state = {
			skip: 0,
			limit: 12,
		};
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

const RecentActivityListContainer = createContainer((props) => {
	const { skip, limit } = props;
	const comments = props.commentsQuery.loading ? [] : props.commentsQuery.comments
		.slice(skip, limit + skip);
	if (!this.props.commentsQuery.variables.sortRecent) {
		this.commentsQuery.refetch({
			sortRecent: true
		});
	}

	return {
		comments,
		ready: !props.commentsQuery.loading
	};
}, RecentActivityList);

export default compose(commentsQuery)(RecentActivityListContainer);
