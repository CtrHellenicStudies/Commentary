import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';

// api
import DiscussionComments from '/imports/api/collections/discussionComments';

// components
import DiscussionCommentsList from '/imports/ui/components/discussionComments/DiscussionCommentsList';

class Discussions extends React.Component {
	static propTypes = {
		discussionComments: React.PropTypes.array,
		settings: React.PropTypes.object,
	}

	render() {
		return (
			<div>
				<h2>Your Comments</h2>
				<hr className="user-divider" />
				<div className="user-discussion-comments">
					<DiscussionCommentsList
						discussionComments={discussionComments}
					/>
				</div>
			</div>
		);
	}
}

const DiscussionsContainer = createContainer(() => {
	let discussionComments = [];
	Meteor.subscribe('settings.tenant', Session.get('tenantId'));
	Meteor.subscribe('user.discussionComments', Meteor.userId());
	Meteor.subscribe('user.annotations', Meteor.userId());
	Meteor.subscribe('user.bookmarks', Meteor.userId());

	discussionComments = DiscussionComments.find({
		userId: Meteor.userId(),
	}).fetch();

	discussionComments.forEach((discussionComment, discussionCommentIndex) => {
		const commentHandle = Meteor.subscribe('comments', {
			_id: discussionComment.commentId,
			tenantId: Session.get('tenantId')
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
		discussionComments,
		settings: Settings.findOne(),
	};
}, Discussions);

export default DiscussionsContainer;
