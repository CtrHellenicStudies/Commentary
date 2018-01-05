import React from 'react';
import createClass from 'create-react-class';
import PropTypes from 'prop-types';
import DiscussionCommentTeaser from './teaser/DiscussionCommetTeaser';

// List of discussionComments
const DiscussionCommentsList = createClass({

	propTypes: {
		discussionComments: PropTypes.array,
		isForLoggedInUser: PropTypes.bool,
	},

	renderNoCommentsMessage() {
		const { isForLoggedInUser } = this.props;
		let message = 'This user has not published any public comments.';

		if (isForLoggedInUser) {
			message = 'You have not created any discussion comments.';
		}

		return (
			<p className="no-results">
				{message}
			</p>
		);
	},

	render() {
		const { discussionComments } = this.props;

		return (
			<div className="discussion-comments-list">
				{discussionComments.map((discussionComment, i) => (
					<DiscussionCommentTeaser
						key={i}
						discussionComment={discussionComment}
					/>
				))}
				{!discussionComments.length ?
					this.renderNoCommentsMessage()
					: ''
				}
			</div>
		);
	},
});


export default DiscussionCommentsList;
