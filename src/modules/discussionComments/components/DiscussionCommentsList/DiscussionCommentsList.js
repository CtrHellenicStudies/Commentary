import React from 'react';
import PropTypes from 'prop-types';

import DiscussionCommentTeaser from '../DiscussionCommentTeaser';


import './DiscussionCommentsList.css';


// List of discussionComments
class DiscussionCommentsList extends React.Component {

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
	}

	render() {
		const { discussionComments } = this.props;

		return (
			<div className="discussion-comments-list">
				{discussionComments ? discussionComments.map((discussionComment, i) => (
					<DiscussionCommentTeaser
						key={i}
						discussionComment={discussionComment}
					/>
				)) :  ''}
				{!discussionComments || !discussionComments.length ?
					this.renderNoCommentsMessage()
					: ''
				}
			</div>
		);
	}
}

DiscussionCommentsList.propTypes = {
	discussionComments: PropTypes.array,
	isForLoggedInUser: PropTypes.bool,
};


export default DiscussionCommentsList;
