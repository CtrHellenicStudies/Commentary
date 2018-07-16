import React from 'react';
import PropTypes from 'prop-types';

// components
import DiscussionCommentsList from '../../../discussionComments/components/DiscussionCommentsList/DiscussionCommentsList';


const Discussion = ({ discussionComments }) => (
	<div>
		<h2>Your Discussion Comments</h2>
		<hr className="user-divider" />
		<div className="user-discussion-comments">
			<DiscussionCommentsList
				discussionComments={discussionComments}
			/>
		</div>
	</div>
);

Discussion.propTypes = {
	discussionComments: PropTypes.array,
};


export default Discussion;
