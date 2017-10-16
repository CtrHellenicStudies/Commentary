import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import Card from 'material-ui/Card';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

// lib:
import muiTheme from '/imports/lib/muiTheme';

const DiscussionCommentTeaser = React.createClass({

	propTypes: {
		discussionComment: PropTypes.object.isRequired,
	},

	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
	},

	getChildContext() {
		return {
			muiTheme: getMuiTheme(muiTheme),
		};
	},

	render() {
		const { discussionComment } = this.props;

		if (!discussionComment) {
			return null;
		}

		const commentaryLink = `/commentary/?works=${discussionComment.comment.work.slug
		}&subworks=${discussionComment.comment.subwork.title}&lineFrom=${discussionComment.comment.lineFrom}`;
		const commentLink = `/commentary/?_id=${discussionComment.commentId}`;

		let status;

		if (discussionComment.status === 'pending') {
			status = 'Pending approval';
		} else if (discussionComment.status === 'trash') {
			status = 'This comment was made private by an Administrator';
		}

		return (
			<Card
				className="user-discussion-comment paper-shadow clearfix"
			>
				<div className="card-title-outer">
					<div className="card-title-text">
						<a
							className="user-discussion-comment-title"
							href={commentaryLink}
						>
							Comment on { discussionComment.comment.work.title } { discussionComment.comment.subwork.title}.{ discussionComment.comment.lineFrom }
						</a>
						{status ?
							<span className="user-discussion-comment-status">
								{status}
							</span>
						: ''}
					</div>
				</div>
				<div className="card-content">
					<p>
						{ discussionComment.content }
					</p>
					<FlatButton
						label={`Context (${discussionComment.otherCommentsCount})`}
						className="user-discussion-comment-replies"
						href={commentLink}
						icon={<FontIcon className="mdi mdi-comment" />}
						style={{
							height: 'auto',
							maxHeight: 'none',
							display: 'block',
							margin: '10px 30px 30px',
						}}
					/>
				</div>
			</Card>);
	},

});

const DiscussionCommentTeaserContainer = createContainer(({ discussionComment }) => {
	let handle;
	let user;

	if (discussionComment) {
		handle = Meteor.subscribe('users.id', discussionComment.userId);
		user = Meteor.users.findOne({ _id: discussionComment.userId });
	}

	return {
		user,
		ready: handle && handle.ready(),
		discussionComment,
	};
}, DiscussionCommentTeaser);

export default DiscussionCommentTeaserContainer;
