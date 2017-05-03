import React from 'react';

// List of discussionComments
const DiscussionCommentsList = React.createClass({

	propTypes: {
		discussionComments: React.PropTypes.array,
	},

	render() {
		return (
			<div className="discussion-comments-list">

				{this.props.discussionComments.map((discussionComment, i) => (
					<DiscussionCommentTeaser
						key={i}
						discussionComment={discussionComment}
					/>
				))}
				{!this.props.discussionComments.length ?
					<p className="no-results">No comments found.</p>
					: ''
				}

			</div>


		);
	},


});


export default DiscussionCommentsList;
