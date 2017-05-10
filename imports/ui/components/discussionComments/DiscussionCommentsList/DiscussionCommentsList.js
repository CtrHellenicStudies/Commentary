import React from 'react';
import DiscussionCommentTeaser from '/imports/ui/components/discussionComments/DiscussionCommentTeaser';

// List of discussionComments
const DiscussionCommentsList = React.createClass({

	propTypes: {
		discussionComments: React.PropTypes.array,
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
					<p className="no-results">No comments found.</p>
					: ''
				}

			</div>
		);
	},
});


export default DiscussionCommentsList;
