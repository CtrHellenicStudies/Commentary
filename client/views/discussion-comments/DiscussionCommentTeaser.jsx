import Card from 'material-ui/Card';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

// discussionComment Teaser
DiscussionCommentTeaser = React.createClass({

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	propTypes: {
		discussionComment: React.PropTypes.object.isRequired
	},


	render() {
		let discussionComment = this.props.discussionComment;

		 return (
			 <Card	className="user-discussion-comment paper-shadow wow fadeInUp clearfix" data-wow-duration="0.2s">
					 <div className="card-title-outer">
							 <div className="card-title-text">
									 {/*<a className="user-discussion-comment-title" href="/commentary/?q=work.{discussion_comment.comment.work.id}:book.{discussion_comment.comment.subwork.id}:line%20from.{discussion_comment.comment.line_from}" >*/}
									 <a className="user-discussion-comment-title" href="/commentary/" >
											 Comment on {discussionComment.comment.work.title} {discussionComment.comment.subwork.title}.{discussionComment.comment.lineFrom}
									 </a>
							 </div>
					 </div>
					 <div className="card-content">
							<p>
								 {discussionComment.content}
							 </p>

							 <FlatButton
								 label={"Context (" + discussionComment.otherCommentsCount + ")"}
								 className="user-discussion-comment-replies"
								 href="/commentary/"
								 icon={<FontIcon className="mdi mdi-comment" />}
								 >
							 </FlatButton>
					 </div>

			 </Card>			);
		}

});
