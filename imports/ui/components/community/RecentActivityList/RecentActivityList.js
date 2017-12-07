import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import RaisedButton from 'material-ui/RaisedButton';
import { compose } from 'react-apollo';
import { commentsQuery } from '/imports/graphql/methods/comments';

// components
import RecentActivityTeaser from '../RecentActivityTeaser';

class RecentActivityList extends Component {
	static propTypes = {
		comments: PropTypes.array,
		loadMore: PropTypes.func,
		commentsQuery: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			skip: 0,
			limit: 12,
		};
		if (!this.props.commentsQuery.variables.sortRecent) {
			this.commentsQuery.refetch({
				sortRecent: true
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		const comments = nextProps.commentsQuery.loading ? [] : nextProps.commentsQuery.comments
		.slice(skip, limit + skip);

		this.setState({
			comments,
			ready: !nextProps.commentsQuery.loading
		});
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

export default compose(commentsQuery)(RecentActivityList);
