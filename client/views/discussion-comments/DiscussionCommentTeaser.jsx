import Card from 'material-ui/Card';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

// discussionComment Teaser
DiscussionCommentTeaser = React.createClass({

	propTypes: {
		discussionComment: React.PropTypes.object.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getChildContext() {
		return {
			muiTheme: getMuiTheme(baseTheme),
		};
	},

	render() {
		const discussionComment = this.props.discussionComment;
		const commentaryLink = `/commentary/?works=${discussionComment.comment.work.slug
			}&subworks=${discussionComment.comment.subwork.title}`;
		const commentLink = `/commentary/?_id=${discussionComment.commentId}`;
		return (
			<Card
				className="user-discussion-comment paper-shadow wow fadeInUp clearfix"
				data-wow-duration="0.2s"
			>
				<div className="card-title-outer">
					<div className="card-title-text">
						<a
							className="user-discussion-comment-title"
							href={commentaryLink}
						>
							Comment on { discussionComment.comment.work.title }
							{ discussionComment.comment.subwork.title}.{ discussionComment.comment.lineFrom }
						</a>
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
					/>
				</div>
			</Card>);
	},

});
