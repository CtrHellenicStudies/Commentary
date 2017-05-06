import React from 'react';
import Card from 'material-ui/Card';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

// lib:
import muiTheme from '/imports/lib/muiTheme';

const DiscussionCommentTeaser = React.createClass({

	propTypes: {
		discussionComment: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getChildContext() {
		return {
			muiTheme: getMuiTheme(muiTheme),
		};
	},

	getMeteorData() {
		const { discussionComment } = this.props;
		const handle = Meteor.subscribe('users.id', discussionComment.userId);
		const user = Meteor.users.findOne({ _id: discussionComment.userId });

		return {
			user,
			ready: handle.ready(),
		};
	},

	render() {
		const { discussionComment } = this.props;
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

export default DiscussionCommentTeaser;
