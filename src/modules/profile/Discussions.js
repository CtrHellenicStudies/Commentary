import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { compose } from 'react-apollo';

// graphql
import { commentsQuery } from '../../graphql/methods/comments';
import { discussionCommentsQuery } from '../../graphql/methods/discussionComments';

// components
import DiscussionCommentsList from '../discussionComments/DiscussionCommentsList';

class Discussions extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.props.discussionCommentsQuery.refetch({
			userId: Cookies.getItem('user'),
			discussionComments: [] // TODO
		});
	}
	render() {
		const { discussionComments } = this.state;

		return (
			<div>
				<h2>Your Discussion Comments</h2>
				<hr className="user-divider" />
				<div className="user-discussion-comments">
					<DiscussionCommentsList
						discussionComments={discussionComments}
						isForLoggedInUser
					/>
				</div>
			</div>
		);
	}
}
Discussions.propTypes = {
	discussionCommentsQuery: PropTypes.object
};
export default compose(
	commentsQuery,
	discussionCommentsQuery
)(Discussions);
