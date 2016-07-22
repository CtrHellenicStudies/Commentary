
import RaisedButton from 'material-ui/RaisedButton';

CommentLemma = React.createClass({

  propTypes: {
    comment_group: React.PropTypes.object.isRequired
  },

  getInitialState(){

  },

  render() {

    return (

      <div class="comment-outer comment-lemma-comment-outer">

          <div class="comment-group-meta">
              <div class="comment-group-meta-inner">
                  <div class="comment-group-ref">
                      <span class="comment-group-ref-above">
                          {comment_group.work.title} {comment_group.subwork.title}
                      </span>
                      <h2 class="comment-group-ref-below">{comment_group.line_from}<span ng-show="comment_group.line_to">-{comment_group.line_to}</span></h2>

                  </div>
                  <div class="comment-group-commenters">

                      <div class="comment-author" ng-repeat="commentator in comment_group.commentators" data-commentator-id="{commentator.id}">
                          <span class="comment-author-name">{commentator.name}</span>
                          <div class="comment-author-image-wrap paper-shadow">
                              <a href="#" ng-click="go_to_author_comment($event)" >

                                  <img ng-src="/assets/{commentator.thumbnail}" ng-show="commentator.thumbnail.length">
                                  <img ng-src="/assets/default_user.jpg" ng-hide="commentator.thumbnail.length">

                              </a>

                          </div>
                      </div>

                  </div>
              </div>

          </div>

          <article class="comment  lemma-comment paper-shadow " layout="column">
              <p class="lemma-text" ng-repeat="lemma in comment_group.selected_edition.lines" ng-bind="lemma.html"></p>
              <div class="edition-tabs tabs">
                  <RaisedButton data-edition="{edition.title}" aria-label="Edition {edition.title}" class="edition-tab tab" ng-class="{'selected-edition-tab paper-shadow':$first}" ng-click="toggle_edition($event)" ng-repeat="edition in comment_group.editions">
                      {edition.title}
                  </RaisedButton>
              </div>
              <div class="context-tabs tabs">
                  <RaisedButton aria-label="Context" class="context-tab tab" ng-click="show_lemma_panel($event)">
                      Context
                      <i class="mdi mdi-chevron-right"></i>
                  </RaisedButton>
              </div>
          </article>
          <div class="discussion-wrap">
          </div>
      </div>


     );
   }

});
