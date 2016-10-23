// List of discussionComments
DiscussionCommentsList = React.createClass({

	// This mixin makes the getMeteorData method discussionComment
	// mixins: [ReactMeteorData],

	propTypes: {
		discussionComments: React.PropTypes.array,
	},

	// Loads items from the discussionComments collection and puts them on this.data.discussionComments
	/*
	getMeteorData() {
		let query = {};

		return {
			discussionComments: DiscussionComments.find(query, {sort: {author: 1, title: 1}}).fetch()
		};
	},
	*/

	render() {
		 return (
			 <div className="discussion-comments-list">

				 {this.props.discussionComments.map((discussionComment, i) => {
					return (<DiscussionCommentTeaser
						key={i}
						discussionComment={discussionComment}
     />);
				})}
				{!this.props.discussionComments.length ?
					<p className="no-results">You haven't created any comments yet.</p>
					: ''
				}

			 </div>


			);
	},


});
