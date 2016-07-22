import RaisedButton from 'material-ui/RaisedButton';

CommentDiscussion = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {
    }

  },

  render() {

    var user_is_loggedin = false;


    return (

        <div className="discussion-wrap" ng-controller="DiscussionController as d">
            <div ng-click="show_discussion( $event )" className="continue-discussion">
                <i className="mdi mdi-comment"></i>
                <span className="continue-discussion-text"
                      ng-show="$parent.comment.discussion_comments.length > 0">{$parent.comment
                .discussion_comments.length}</span>
            </div>

            <div className="ahcip-spinner" ng-hide="discussion_thread">
                <div className="double-bounce1"></div>
                <div className="double-bounce2"></div>

            </div> {/*<!-- .spinner -->*/}

            <div className="discussion-thread" layout="column">
                <div className="add-comment-wrap paper-shadow " layout="column">
                    <RaisedButton aria-label="Close Discussion" className="mdi mdi-close close-discussion paper-shadow" ng-click="hide_discussion($event)"></RaisedButton>
                    <form className="new-comment-form" name="new-comment-form">
                        <div className="add-comment-row-1" >
                            {/*<sec:ifLoggedIn>
                                <!--div className="profile-picture paper-shadow">
                                    <asset:image src="default_user.jpg"/>
                                </div-->
                            </sec:ifLoggedIn>*/}
                            { user_is_loggedin ?
                                <textarea className="new-comment-text" ng-model="new_comment_text"
                                          placeholder="Enter your comment here . . . " >
                                </textarea>
                                : <textarea className="new-comment-text" ng-model="new_comment_text"
                                          placeholder="Please login to write a comment." >
                                </textarea>
                            }
                        </div>
                        <div className="add-comment-row-2 add-comment-row">
                            <div className="error-message">
                                <span className="error-message-text">Please enter your text to submit.</span>
                            </div>
                            { user_is_loggedin ?
                                <RaisedButton aria-label="Submit" type="submit" className="submit-comment-button paper-shadow" ng-click="add_discussion_comment( $event )" >Submit</RaisedButton>
                              :
                                <div className="new-comment-login">
                                        <RaisedButton aria-label="Join" className="join-link" ng-click="show_login_modal($event, 'signup')">
                                            Join
                                        </RaisedButton>
                                        <RaisedButton aria-label="Login" className="login-link"
                                                   ng-click="show_login_modal($event, 'signin')">
                                            Login
                                        </RaisedButton>
                                </div>
                              }
                        </div>
                    </form>
                </div>
                <div className="sort-by-wrap" ng-show="discussion_thread.discussion_comments.length">
                    <span className="sort-by-label">Sort by:</span>
                    <RaisedButton aria-label="Sort by Top" className="sort-by-option selected-sort sort-by-top" ng-click="sort_by_option('top')">Top</RaisedButton>
                    <RaisedButton aria-label="Sort by Newest" className="sort-by-option sort-by-new" ng-click="sort_by_option('new')">Newest</RaisedButton>
                </div>
                <div className="no-results-wrap" ng-show="discussion_thread.discussion_comments.length === 0">
                    <span className="no-results-text"></span>
                </div>
                <div className="discussion-comment paper-shadow" data-comment_id="{discussion_comment.id}" data-comment_user_id="{discussion_comment.user.id}" ng-repeat="discussion_comment in discussion_thread.discussion_comments">
                    <div className="inner-comment-row" ng-hide="discussion_comment.status === 'removed'">

                        <div className="discussion-commenter-profile-picture profile-picture paper-shadow" ng-show="discussion_comment.user.has_thumbnail">
                            <img src="/images/{discussion_comment.user.id}"/>
                        </div>

                        <div className="discussion-commenter-meta">
                            <span className="discussion-commenter-name">
                                {discussion_comment.user.nicename}
                            </span>
                            <span className="discussion-comment-date">
                                <span ng-show="discussion_comment.status == 'edited'">Edited:</span>
                                {discussion_comment.updated}
                            </span>
                        </div>

                    </div>
                    <div className="inner-comment-row">
                        <div className="discussion-comment-text">
                            <div ng-bind-html="discussion_comment.content" ng-hide="discussion_comment.edit_enabled"></div>
                            <form className="update-comment-form clearfix" name="update-comment-form" ng-submit="update_discussion_comment($event)" ng-show="discussion_comment.edit_enabled">
                              <textarea className="new-comment-text" ng-model="discussion_comment.content" ></textarea>
                              <RaisedButton aria-label="Update" type="submit" className="submit-comment-button paper-shadow" >Update</RaisedButton>
                              <RaisedButton aria-label="Close Update"
                                           className="close-form-button " ng-click="close_update($event)">Close
                              </RaisedButton>
                            </form>

                        </div>
                    </div>
                    <div className="inner-comment-row" ng-hide="discussion_comment.status === 'removed'">
                        <RaisedButton aria-label="Upvote" ng-click="upvote($event)"
                                   ng-className="discussion_comment.user_has_upvoted ? 'vote-up upvoted' : 'vote-up'">
                            <i className="mdi mdi-chevron-up"></i>
                            <span>{discussion_comment.votes}</span>
                        </RaisedButton>
                        <RaisedButton aria-label="Reply" ng-click="show_reply_form($event)" className="reply">
                            Reply
                        </RaisedButton>
                        {/*<!--RaisedButton aria-label="Share" className="share" ng-click="share_discussion_comment($event)">
                            Share
                        </RaisedButton-->*/}
                        <RaisedButton aria-label="Edit" ng-click="edit_discussion_comment($event)" className="edit" ng-show="discussion_comment.editable === true">
                            Edit
                        </RaisedButton>
                        <RaisedButton aria-label="Remove" ng-click="remove_discussion_comment($event)" className="remove" ng-show="false">
                            Remove
                        </RaisedButton>
                    </div>


                    <div className="reply-create-form" ng-show="discussion_comment.reply_enabled">
                        <div className="add-comment-wrap">
                            <form className="new-comment-form" name="new-comment-form" ng-submit="add_discussion_reply($event)">
                                <div className="add-comment-row-1" >
                                    {/*<!--div className="profile-picture paper-shadow">
                                        <asset:image src="default_user.jpg"/>
                                    </div-->*/}
                                    <textarea className="new-comment-text" ng-model="$parent.new_reply_text" placeholder="Enter your reply here . . . " enter-submit="add_discussion_reply($event)">
                                    </textarea>
                                    <RaisedButton aria-label="Submit" type="submit" className="submit-comment-button paper-shadow" >Submit</RaisedButton>
                                    <RaisedButton aria-label="Close Reply"
                                               className="close-form-button " ng-click="close_reply($event)">Close
                                    </RaisedButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="discussion-comment-children">

                        <div className="discussion-comment discussion-comment-child" data-comment_id="{[discussion_comment_child.id]}" data-comment_user_id="{[discussion_comment_child.user.id]}" ng-repeat="discussion_comment_child in discussion_comment.children">
                            <div className="inner-comment-row">
                                <div className="discussion-commenter-profile-picture profile-picture paper-shadow" ng-show="discussion_comment_child.user.has_thumbnail">
                                    <img ng-src="/images/{discussion_comment_child.user.id}"/>
                                </div>
                                <div className="discussion-commenter-meta">
                                    <span className="discussion-commenter-name">
                                        {discussion_comment_child.user.nicename}
                                    </span>
                                    <span className="discussion-comment-date">
                                        {discussion_comment_child.updated}
                                    </span>
                                </div>

                            </div>
                            <div className="inner-comment-row">
                                <div className="discussion-comment-text">
                                    <p ng-bind-html="discussion_comment_child.content"></p>
                                </div>
                            </div>
                            <div className="inner-comment-row">
                                <RaisedButton aria-label="Upvote" className="vote-up"
                                           ng-click="upvote($event)">
                                    <i className="mdi mdi-chevron-up"></i>
                                    <span>{discussion_comment_child.votes}</span>
                                </RaisedButton>
                                {/*<!--RaisedButton aria-label="Downvote" className="vote-down">
                                    <i className="mdi mdi-chevron-down"></i>
                                    <span>{discussion_comment_child.votes.down}</span>
                                </RaisedButton-->*/}

                                {/*<!--RaisedButton aria-label="Share" className="share">
                                    Share
                                </RaisedButton-->*/}
                                <RaisedButton aria-label="Edit" ng-click="edit_reply($event)" className="edit" ng-show="discussion_comment.editable">
                                    Edit
                                </RaisedButton>
                                <RaisedButton aria-label="Remove" ng-click="remove_reply($event)" className="remove">
                                    Remove
                                </RaisedButton>

                            </div>



                            <div className="discussion-comment-children">


                            </div>

                        </div>{/*<!-- .discussion-comment-child -->*/}

                    </div>{/*<!-- .discussion-comment-children -->*/}

                </div>{/*<!-- .discussion-comment -->*/}

            </div>{/*<!-- .discussion-thread -->*/}

        </div>

     );
   }

});
