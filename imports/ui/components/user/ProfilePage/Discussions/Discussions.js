import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import { compose } from 'react-apollo';

// models
import DiscussionComments from '/imports/models/discussionComments';
import Comments from '/imports/models/comments';
import Settings from '/imports/models/settings';

// graphql
import { settingsQuery } from '/imports/graphql/methods/settings';

// components
import DiscussionCommentsList from '/imports/ui/components/discussionComments/DiscussionCommentsList';

class Discussions extends React.Component {
	static propTypes = {
		discussionComments: PropTypes.array,
		settings: PropTypes.object,
	}

	render() {
		const { discussionComments } = this.props;

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

const DiscussionsContainer = createContainer((props) => {
	let discussionComments = [];
	const tenantId = Session.get('tenantId');
	Meteor.subscribe('user.discussionComments', Meteor.userId());
	Meteor.subscribe('user.annotations', Meteor.userId());
	Meteor.subscribe('user.bookmarks', Meteor.userId());

	discussionComments = DiscussionComments.find({
		userId: Meteor.userId(),
	}).fetch();

	discussionComments.forEach((discussionComment, discussionCommentIndex) => {
		const commentHandle = Meteor.subscribe('comments', {
			_id: discussionComment.commentId,
			tenantId: tenantId
		}, 0, 1);

		if (commentHandle.ready()) {
			const comments = Comments.find().fetch();
			if (comments.length) {
				discussionComments[discussionCommentIndex].comment = comments[0];
			} else {
				discussionComments[discussionCommentIndex].comment = {
					work: '',
					subwork: '',
					discussionComments: [],
				};
			}
		} else {
			discussionComments[discussionCommentIndex].comment = {
				work: '',
				subwork: '',
				discussionComments: [],
			};
		}

		discussionComments[discussionCommentIndex].otherCommentsCount =
			DiscussionComments.find({ commentId: discussionComment.commentId }).count();
	});

	return {
		discussionComments: [],
		settings: props.settingsQuery.loading ? {} : props.settingsQuery.settings.find(x => x.tenantId === tenantId)
	};
}, Discussions);

export default compose(settingsQuery)(DiscussionsContainer);
