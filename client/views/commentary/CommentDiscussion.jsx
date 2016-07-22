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


    return (

        <div class="discussion-wrap" ng-controller="DiscussionController as d">
            <div ng-click="show_discussion( $event )" class="continue-discussion">
                <i class="mdi mdi-comment"></i>
                <span class="continue-discussion-text"
                      ng-show="$parent.comment.discussion_comments.length > 0">{$parent.comment
                .discussion_comments.length}</span>
            </div>

            <div class="ahcip-spinner" ng-hide="discussion_thread">
                <div class="double-bounce1"></div>
                <div class="double-bounce2"></div>

            </div> {/*<!-- .spinner -->*/}

            <div class="discussion-thread" layout="column">
                <div class="add-comment-wrap paper-shadow " layout="column">
                    <RaisedButton aria-label="Close Discussion" class="mdi mdi-close close-discussion paper-shadow" ng-click="hide_discussion($event)"></RaisedButton>
                    <form class="new-comment-form" name="new-comment-form">
                        <div class="add-comment-row-1" >
                            <sec:ifLoggedIn>
                                {/*<!--div class="profile-picture paper-shadow">
                                    <asset:image src="default_user.jpg"/>
                                </div-->*/}
                            </sec:ifLoggedIn>
                            <sec:ifNotLoggedIn>
                                <textarea class="new-comment-text" ng-model="new_comment_text"
                                          placeholder="Please login to write a comment." >
                                </textarea>
                            </sec:ifNotLoggedIn>
                            <sec:ifLoggedIn>
                                <textarea class="new-comment-text" ng-model="new_comment_text"
                                          placeholder="Enter your comment here . . . " >
                                </textarea>
                            </sec:ifLoggedIn>
                        </div>
                        <div class="add-comment-row-2 add-comment-row">
                            <div class="error-message">
                                <span class="error-message-text">Please enter your text to submit.</span>
                            </div>
                            <div class="new-comment-login">
                                <sec:ifNotLoggedIn>
                                    <RaisedButton aria-label="Join" class="join-link" ng-click="show_login_modal($event, 'signup')">
                                        Join
                                    </RaisedButton>
                                    <RaisedButton aria-label="Login" class="login-link"
                                               ng-click="show_login_modal($event, 'signin')">
                                        Login
                                    </RaisedButton>
                                </sec:ifNotLoggedIn>
                            </div>
                            <sec:ifLoggedIn>
                                <RaisedButton aria-label="Submit" type="submit" class="submit-comment-button paper-shadow" ng-click="add_discussion_comment( $event )" >Submit</RaisedButton>
                            </sec:ifLoggedIn>
                        </div>
                    </form>
                </div>
                <div class="sort-by-wrap" ng-show="discussion_thread.discussion_comments.length">
                    <span class="sort-by-label">Sort by:</span>
                    <RaisedButton aria-label="Sort by Top" class="sort-by-option selected-sort sort-by-top" ng-click="sort_by_option('top')">Top</RaisedButton>
                    <RaisedButton aria-label="Sort by Newest" class="sort-by-option sort-by-new" ng-click="sort_by_option('new')">Newest</RaisedButton>
                </div>
                <div class="no-results-wrap" ng-show="discussion_thread.discussion_comments.length === 0">
                    <span class="no-results-text"></span>
                </div>
                <div class="discussion-comment paper-shadow" data-comment_id="{discussion_comment.id}" data-comment_user_id="{discussion_comment.user.id}" ng-repeat="discussion_comment in discussion_thread.discussion_comments">
                    <div class="inner-comment-row" ng-hide="discussion_comment.status === 'removed'">

                        <div class="discussion-commenter-profile-picture profile-picture paper-shadow" ng-show="discussion_comment.user.has_thumbnail">
                            <img ng-src="/user/showThumbnail/{discussion_comment.user.id}">
                        </div>

                        <div class="discussion-commenter-meta">
                            <span class="discussion-commenter-name">
                                {discussion_comment.user.nicename}
                            </span>
                            <span class="discussion-comment-date">
                                <span ng-show="discussion_comment.status == 'edited'">Edited:</span>
                                {discussion_comment.updated | amDateFormat:'DD MMMM YYYY'}
                            </span>
                        </div>

                    </div>
                    <div class="inner-comment-row">
                        <div class="discussion-comment-text">
                            <div ng-bind-html="discussion_comment.content" ng-hide="discussion_comment.edit_enabled"></div>
                            <form class="update-comment-form clearfix" name="update-comment-form" ng-submit="update_discussion_comment($event)" ng-show="discussion_comment.edit_enabled">
                              <textarea class="new-comment-text" ng-model="discussion_comment.content" ></textarea>
                              <RaisedButton aria-label="Update" type="submit" class="submit-comment-button paper-shadow" >Update</RaisedButton>
                              <RaisedButton aria-label="Close Update"
                                           class="close-form-button " ng-click="close_update($event)">Close
                              </RaisedButton>
                            </form>

                        </div>
                    </div>
                    <div class="inner-comment-row" ng-hide="discussion_comment.status === 'removed'">
                        <RaisedButton aria-label="Upvote" ng-click="upvote($event)"
                                   ng-class="discussion_comment.user_has_upvoted ? 'vote-up upvoted' : 'vote-up'">
                            <i class="mdi mdi-chevron-up"></i>
                            <span>{discussion_comment.votes}</span>
                        </RaisedButton>
                        <RaisedButton aria-label="Reply" ng-click="show_reply_form($event)" class="reply">
                            Reply
                        </RaisedButton>
                        <!--RaisedButton aria-label="Share" class="share" ng-click="share_discussion_comment($event)">
                            Share
                        </RaisedButton-->
                        <RaisedButton aria-label="Edit" ng-click="edit_discussion_comment($event)" class="edit" ng-show="discussion_comment.editable === true">
                            Edit
                        </RaisedButton>
                        <RaisedButton aria-label="Remove" ng-click="remove_discussion_comment($event)" class="remove" ng-show="false">
                            Remove
                        </RaisedButton>
                    </div>


                    <div class="reply-create-form" ng-show="discussion_comment.reply_enabled">
                        <div class="add-comment-wrap">
                            <form class="new-comment-form" name="new-comment-form" ng-submit="add_discussion_reply($event)">
                                <div class="add-comment-row-1" >
                                    {/*<!--div class="profile-picture paper-shadow">
                                        <asset:image src="default_user.jpg"/>
                                    </div-->*/}
                                    <textarea class="new-comment-text" ng-model="$parent.new_reply_text" placeholder="Enter your reply here . . . " enter-submit="add_discussion_reply($event)">
                                    </textarea>
                                    <RaisedButton aria-label="Submit" type="submit" class="submit-comment-button paper-shadow" >Submit</RaisedButton>
                                    <RaisedButton aria-label="Close Reply"
                                               class="close-form-button " ng-click="close_reply($event)">Close
                                    </RaisedButton>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div class="discussion-comment-children">

                        <div class="discussion-comment discussion-comment-child" data-comment_id="{[discussion_comment_child.id]}" data-comment_user_id="{[discussion_comment_child.user.id]}" ng-repeat="discussion_comment_child in discussion_comment.children">
                            <div class="inner-comment-row">
                                <div class="discussion-commenter-profile-picture profile-picture paper-shadow" ng-show="discussion_comment_child.user.has_thumbnail">
                                    <img ng-src="/user/showThumbnail/{discussion_comment_child.user.id}">
                                </div>
                                <div class="discussion-commenter-meta">
                                    <span class="discussion-commenter-name">
                                        {discussion_comment_child.user.nicename}
                                    </span>
                                    <span class="discussion-comment-date">
                                        {discussion_comment_child.updated | amDateFormat:'DD MMMM YYYY'}
                                    </span>
                                </div>

                            </div>
                            <div class="inner-comment-row">
                                <div class="discussion-comment-text">
                                    <p ng-bind-html="discussion_comment_child.content"></p>
                                </div>
                            </div>
                            <div class="inner-comment-row">
                                <RaisedButton aria-label="Upvote" class="vote-up"
                                           ng-click="upvote($event)">
                                    <i class="mdi mdi-chevron-up"></i>
                                    <span>{discussion_comment_child.votes}</span>
                                </RaisedButton>
                                {/*<!--RaisedButton aria-label="Downvote" class="vote-down">
                                    <i class="mdi mdi-chevron-down"></i>
                                    <span>{discussion_comment_child.votes.down}</span>
                                </RaisedButton-->*/}

                                {/*<!--RaisedButton aria-label="Share" class="share">
                                    Share
                                </RaisedButton-->*/}
                                <RaisedButton aria-label="Edit" ng-click="edit_reply($event)" class="edit" ng-show="discussion_comment.editable">
                                    Edit
                                </RaisedButton>
                                <RaisedButton aria-label="Remove" ng-click="remove_reply($event)" class="remove">
                                    Remove
                                </RaisedButton>

                            </div>



                            <div class="discussion-comment-children">


                            </div>

                        </div>{/*<!-- .discussion-comment-child -->*/}

                    </div>{/*<!-- .discussion-comment-children -->*/}

                </div>{/*<!-- .discussion-comment -->*/}

            </div>{/*<!-- .discussion-thread -->*/}

        </div>

     );
   }

});
