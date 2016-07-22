import Card from 'material-ui/Card';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';

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
    let discussionComment_url = "/discussionComments/" + discussionComment.author + "/" + discussionComment.slug;

     return (
       <Card  class="user-discussion-comment paper-shadow wow fadeInUp clearfix" data-wow-duration="0.2s">
           <div className="card-title-outer">
               <div className="card-title-text">
                   <a class="user-discussion-comment-title" href="/commentary/?q=work.{discussion_comment.comment.work.id}:book.{discussion_comment.comment.subwork.id}:line%20from.{discussion_comment.comment.line_from}" >
                       Comment on {discussion_comment.comment.work.title} {discussion_comment.comment.subwork.title}.{discussion_comment.comment.line_from}
                   </a>
               </div>
           </div>
           <div className="card-content">
              <p>
                 {discussion_comment.content}
               </p>

               <RaisedButton class="user-discussion-comment-replies" href="/commentary/?q=work.{discussion_comment.comment.work.id}:book.{discussion_comment.comment.subwork.id}:line%20from.{discussion_comment.comment.line_from}" >
                   <i class="mdi mdi-comment"></i>
                   <span>
                       {discussion_comment.comment.discussion_comments.size() - 1} Discussion Comments

                   </span>
               </RaisedButton>
           </div>

       </Card>      );
    }

});
