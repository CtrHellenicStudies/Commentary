import RaisedButton from 'material-ui/RaisedButton';

CommentDiscussion = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {
			hidden : true
    }

  },

  mixins: [ReactMeteorData],

  getMeteorData(){
    var query = {},
				sort = {updated: -1};


		return {
			loaded : true,
			discussionComments: DiscussionComments.find(query, {sort:sort}).fetch()
		};
	},

	toggleDiscussion(){
		this.setState({
			hidden : !this.state.hidden
		});

	},

  render() {

    var user_is_loggedin = false;


    return (

        <div className="discussion-wrap" >
            <div
							onClick={this.toggleDiscussion}
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
                    <RaisedButton
											label="Close Discussion"
											className="mdi mdi-close close-discussion paper-shadow"
											onClick={this.hideDiscussion}>
                    </RaisedButton>

                    <form className="new-comment-form" name="new-comment-form">
                        <div className="add-comment-row-1" >
	                          <div className="profile-picture paper-shadow">
	                              <img src="/images/default_user.jpg"/>
	                          </div>
                            { user_is_loggedin ?
                                <textarea className="new-comment-text"
                                          placeholder="Enter your comment here . . . " >
                                </textarea>
                                : <textarea className="new-comment-text"
                                          placeholder="Please login to write a comment." >
                                </textarea>
                            }
                        </div>
                        <div className="add-comment-row-2 add-comment-row">
                            <div className="error-message">
                                <span className="error-message-text">Please enter your text to submit.</span>
                            </div>
                            { user_is_loggedin ?
                                <RaisedButton
																	label="Submit"
																	type="submit"
																	className="submit-comment-button paper-shadow"
																	onClick={this.addDiscussionComment} ></RaisedButton>
                              :
                                <div className="new-comment-login">
                                  <RaisedButton
																		label="Join"
																		className="join-link"
																		onClick={this.showLoginModal}>
                                  </RaisedButton>
                                  <RaisedButton
																		label="Login"
																		className="login-link"
																		onClick={this.showLoginModal}>
                                  </RaisedButton>
                                </div>
                              }
                        </div>
                    </form>
                </div>
                <div className="sort-by-wrap" >
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
                </div>
                <div className="no-results-wrap" >
                    <span className="no-results-text">No discussion comments.</span>
                </div>
								{this.data.discussionComments.map(function(discussionComment, i){

	                return <div
										className="discussion-comment paper-shadow"
										data-comment_id={discussionComment._id}
										data-comment_user_id={discussionComment.user._id}
										>
	                    <div
												className="inner-comment-row">

	                        <div className="discussion-commenter-profile-picture profile-picture paper-shadow">
	                            <img src="/images/default_user.png"/>
	                        </div>

	                        <div className="discussion-commenter-meta">
	                            <span className="discussion-commenter-name">
	                                {discussionComment.user.nicename}
	                            </span>
	                            <span className="discussion-comment-date">
	                                <span >Updated:</span>
	                                {discussionComment.updated}
	                            </span>
	                        </div>

	                    </div>
	                    <div className="inner-comment-row">
	                        <div className="discussion-comment-text">

	                            <div
																dangerouslySetInnerHTML={{ __html: discussionComment.content}}
																></div>

															{false ?
		                            <form className="update-comment-form clearfix" name="update-comment-form" >
		                              <textarea className="new-comment-text" ></textarea>
		                              <RaisedButton label="Update" type="submit" className="submit-comment-button paper-shadow" >Update</RaisedButton>
		                              <RaisedButton label="Close Update"
		                                           className="close-form-button " onClick={this.closeUpdate}>Close
		                              </RaisedButton>
		                            </form>
															: ""}

	                        </div>
	                    </div>
	                    <div className="inner-comment-row" >
	                        <FlatButton
														label={discussionComment.votes}
														onClick={this.upvoteDiscussionComment}
	                          className="vote-up upvoted"
					                  icon={<FontIcon className="mdi mdi-chevron-up" />}
														>
	                        </FlatButton>
	                        <FlatButton
														label="Reply"
														onClick={this.showReplyForm}
														className="reply">
	                        </FlatButton>
	                        {/*<!--RaisedButton label="Share" className="share" onClick="share_discussionComment($event)">
	                            Share
	                        </RaisedButton-->*/}
	                        <FlatButton
														label="Edit"
														onClick={this.editDiscussionComment}
														className="edit"
														>
	                        </FlatButton>
	                        <FlatButton
														label="Remove"
														onClick={this.removeDiscussionComment}
														className="remove"
														>
	                        </FlatButton>
	                    </div>


											{false ?
		                    <div className="reply-create-form" >
		                        <div className="add-comment-wrap">
		                            <form className="new-comment-form" name="new-comment-form" >
		                                <div className="add-comment-row-1" >
		                                    {/*<!--div className="profile-picture paper-shadow">
		                                        <asset:image src="default_user.jpg"/>
		                                    </div-->*/}
		                                    <textarea className="new-comment-text" placeholder="Enter your reply here . . . " enter-submit="add_discussion_reply($event)">
		                                    </textarea>
		                                    <RaisedButton label="Submit" type="submit" className="submit-comment-button paper-shadow" >Submit</RaisedButton>
		                                    <RaisedButton label="Close Reply"
		                                               className="close-form-button " onClick={this.closeReply}>Close
		                                    </RaisedButton>
		                                </div>
		                            </form>
		                        </div>
		                    </div>
											: ""}

	                    <div className="discussion-comment-children">

												{discussionComment.children.map(function(discussionCommentChild){
	                        <div
														className="discussion-comment discussion-comment-child" data-comment_id={discussionCommentChild._id}
														data-comment_user_id={discussionCommentChild.user._id} >
	                            <div className="inner-comment-row">
	                                <div className="discussion-commenter-profile-picture profile-picture paper-shadow">
	                                    <img src="/images/default_user.png"/>
	                                </div>
	                                <div className="discussion-commenter-meta">
	                                    <span className="discussion-commenter-name">
	                                        {discussionCommentChild.user.name}
	                                    </span>
	                                    <span className="discussion-comment-date">
	                                        {discussionCommentChild.updated}
	                                    </span>
	                                </div>

	                            </div>
	                            <div className="inner-comment-row">
	                                <div className="discussion-comment-text">
	                                    <p dangerouslySetInnerHTML={{ __html: discussionCommentChild.content}}></p>
	                                </div>
	                            </div>
	                            <div className="inner-comment-row">
				                        <FlatButton
																	label={discussionComment.votes}
																	onClick={this.upvoteDiscussionComment}
				                          className="vote-up upvoted"
								                  icon={<FontIcon className="mdi mdi-chevron-up" />}
																	>
				                        </FlatButton>
				                        <FlatButton
																	label="Reply"
																	onClick={this.showReplyForm}
																	className="reply">
				                        </FlatButton>
				                        {/*<!--RaisedButton label="Share" className="share" onClick="share_discussionComment($event)">
				                            Share
				                        </RaisedButton-->*/}
				                        <FlatButton
																	label="Edit"
																	onClick={this.editDiscussionComment}
																	className="edit"
																	>
				                        </FlatButton>
				                        <FlatButton
																	label="Remove"
																	onClick={this.removeDiscussionComment}
																	className="remove"
																	>
				                        </FlatButton>

	                            </div>



	                        {/*<!-- .discussion-comment-child -->*/}</div>

												})}

	                    {/*<!-- .discussion-comment-children -->*/}</div>

	                {/*<!-- .discussion-comment -->*/}</div>

								})}

            </div>{/*<!-- .discussion-thread -->*/}

        </div>

     );
   }

});
