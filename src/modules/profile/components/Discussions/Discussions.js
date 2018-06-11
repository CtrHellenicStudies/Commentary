import React, { Component} from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import { compose } from 'react-apollo';

// graphql
import  discussionCommentsQuery from '../../../discussionComments/graphql/queries/discussionCommentsQuery';

// components
import DiscussionCommentsList from '../../../discussionComments/components/DiscussionCommentsList/DiscussionCommentsList';

class Discussions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			discussionComments: []
		};
		const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
		this.props.discussionCommentsQuery.refetch({
			userId: user && user._id,
		});
	}
	componentWillReceiveProps(props) {
		this.setState({
			discussionComments: discussionCommentsQuery.loading ? [] : discussionCommentsQuery.discussionComments
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
// const DiscussionsContainer = createContainer((props) => {
// 	let discussionComments = [];
// 	const { tenantId } = this.props; 
// 	Meteor.subscribe('user.discussionComments', Meteor.userId());
// 	Meteor.subscribe('user.annotations', Meteor.userId());
// 	Meteor.subscribe('user.bookmarks', Meteor.userId());

// 	discussionComments = DiscussionComments.find({
// 		userId: Meteor.userId(),
// 	}).fetch();

// 	discussionComments.forEach((discussionComment, discussionCommentIndex) => {
// 		const commentHandle = Meteor.subscribe('comments', {
// 			_id: discussionComment.commentId,
// 			tenantId: tenantId
// 		}, 0, 1);

// 		if (commentHandle.ready()) {
// 			const comments = Comments.find().fetch();
// 			if (comments.length) {
// 				discussionComments[discussionCommentIndex].comment = comments[0];
// 			} else {
// 				discussionComments[discussionCommentIndex].comment = {
// 					work: '',
// 					subwork: '',
// 					discussionComments: [],
// 				};
// 			}
// 		} else {
// 			discussionComments[discussionCommentIndex].comment = {
// 				work: '',
// 				subwork: '',
// 				discussionComments: [],
// 			};
// 		}

// 		discussionComments[discussionCommentIndex].otherCommentsCount =
// 			DiscussionComments.find({ commentId: discussionComment.commentId }).count();
// 	});

// 	return {
// 		discussionComments: [],
// 		settings: props.settingsQuery.loading ? {} : props.settingsQuery.settings.find(x => x.tenantId === tenantId)
// 	};
// }, Discussions);

Discussions.propTypes = {
	discussionCommentsQuery: PropTypes.object
};
export default compose(
	discussionCommentsQuery
)(Discussions);
