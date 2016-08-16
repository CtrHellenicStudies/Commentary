import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';

DiscussionThread = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired,
		discussionVisible: React.PropTypes.bool.isRequired,
    showDiscussionThread: React.PropTypes.func.isRequired
  },

  getInitialState(){
    return {
    }

  },

  mixins: [ReactMeteorData],

  getMeteorData(){
    var query = {commentId: this.props.comment._id},
				sort = {updated: -1};

		return {
			loaded : true,
			currentUser: Meteor.users.findOne({_id: Meteor.userId()}),
			discussionComments: DiscussionComments.find(query, {sort:sort}).fetch()
		};
	},

	showDiscussionThread(){
			this.props.showDiscussionThread(this.props.comment);
	},
	hideDiscussionThread(){
			this.props.hideDiscussionThread();
	},

	addDiscussionComment(){

		var content = $(this.refs.newCommentForm).find("textarea").val();

		Meteor.call("discussionComments.insert", {
		//DiscussionComments.insert({
			content: content,
			commentId: this.props.comment._id
		});

		$(this.refs.newCommentForm).find("textarea").val("");

	},

	editDiscussionComment(){
		debugger;

	},

	upvoteDiscussionComment(){
		debugger;

	},

  render() {
		var self = this;
    var userIsLoggedIn = this.data.currentUser ? true : false;

		var discussionWrapClass = "discussion-wrap";

		if(this.state.discussionVisible){
			discussionWrapClass += " discussion-visible";

		}

		var textareaPlaceholder = "";
		if(userIsLoggedIn){
			textareaPlaceholder = "Enter your comment here . . .";
		}else {
			textareaPlaceholder = "Please login to enter a comment.";
		}

		console.log("CommentDiscussion.data", this.data);

    return (

        <div className={discussionWrapClass} >
            <div
							onClick={this.showDiscussionThread}
							className="continue-discussion">
                <i className="mdi mdi-comment"></i>
								{this.data.discussionComments.length ?
		                <span className="continue-discussion-text">
											{this.data.discussionComments.length}
										</span>
									: ""
								}
            </div>

						{!this.data.loaded ?
	            <div className="ahcip-spinner" >
	                <div className="double-bounce1"></div>
	                <div className="double-bounce2"></div>

	            </div>
						: ""
						}

            <div className="discussion-thread" >
                <div className="add-comment-wrap paper-shadow " >
									<IconButton
											className="close-discussion paper-shadow"
											iconClassName="mdi mdi-close"
											onClick={this.hideDiscussion}
										/>

									<form ref="newCommentForm" className="new-comment-form" name="new-comment-form">
                      <div className="add-comment-row-1" >
                          <div className="profile-picture paper-shadow">
                              <img src="/images/default_user.jpg"/>
                          </div>
                          <textarea className="new-comment-text"
																		name="newCommentText"
                                    placeholder={textareaPlaceholder} >
                          </textarea>
                      </div>
                      <div className="add-comment-row-2 add-comment-row">
                          <div className="error-message">
                              <span className="error-message-text">Please enter your text to submit.</span>
                          </div>
                          { userIsLoggedIn ?
                              <RaisedButton
																label="Submit"
																className="submit-comment-button paper-shadow"
																onClick={this.addDiscussionComment} ></RaisedButton>
                            :
                              <div className="new-comment-login">
                                <FlatButton
																	label="Join"
																	className="join-link"
																	href="/sign-up">
                                </FlatButton>
                                <FlatButton
																	label="Login"
																	className="login-link"
																	href="/sign-in">
                                </FlatButton>
                              </div>
                            }
                      </div>
                  </form>
                </div>
                <div className="sort-by-wrap" >
									{/*
                    <span className="sort-by-label">Sort by:</span>
                    <RaisedButton
											label="Top"
											className="sort-by-option selected-sort sort-by-top"
											onClick={this.toggleSort}>
                    </RaisedButton>
                    <RaisedButton
											label="Newest"
											className="sort-by-option sort-by-new"
											onClick={this.toggleSort}>
										</RaisedButton>
										*/}
                </div>
								{this.data.discussionComments.length === 0 ?
	                <div className="no-results-wrap" >
	                    <span className="no-results-text">No discussion comments.</span>
	                </div>
									: ""
								}
								{this.data.discussionComments.map(function(discussionComment, i){

	                return <DiscussionComment
										key={i}
										className="discussion-comment paper-shadow"
										discussionComment={discussionComment}
										currentUser={self.data.currentUser}
										/>

								})}

            </div>{/*<!-- .discussion-thread -->*/}

        </div>

     );
   }

});
