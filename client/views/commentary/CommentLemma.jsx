
import RaisedButton from 'material-ui/RaisedButton';

CommentLemma = React.createClass({

  propTypes: {
    comment_group: React.PropTypes.object.isRequired
  },

  getInitialState(){

  },

  render() {

    return (

      <div className="comment-outer comment-lemma-comment-outer">

          <div className="comment-group-meta">
              <div className="comment-group-meta-inner">
                  <div className="comment-group-ref">
                      <span className="comment-group-ref-above">
                          {comment_group.work.title} {comment_group.subwork.title}
                      </span>
                      <h2 className="comment-group-ref-below">{comment_group.line_from}<span ng-show="comment_group.line_to">-{comment_group.line_to}</span></h2>

                  </div>
                  <div className="comment-group-commenters">

                      <div className="comment-author" ng-repeat="commentator in comment_group.commentators" data-commentator-id="{commentator.id}">
                          <span className="comment-author-name">{commentator.name}</span>
                          <div className="comment-author-image-wrap paper-shadow">
                              <a href="#" ng-click="go_to_author_comment($event)" >

                                  <img ng-src="/assets/{commentator.thumbnail}" ng-show="commentator.thumbnail.length"/>
                                  <img ng-src="/assets/default_user.jpg" ng-hide="commentator.thumbnail.length"/>

                              </a>

                          </div>
                      </div>

                  </div>
              </div>

          </div>

          <article className="comment  lemma-comment paper-shadow " layout="column">
              <p className="lemma-text" ng-repeat="lemma in comment_group.selected_edition.lines" ng-bind="lemma.html"></p>
              <div className="edition-tabs tabs">
                  <RaisedButton data-edition="{edition.title}" aria-label="Edition {edition.title}" className="edition-tab tab" ng-className="{'selected-edition-tab paper-shadow':$first}" ng-click="toggle_edition($event)" ng-repeat="edition in comment_group.editions">
                      {edition.title}
                  </RaisedButton>
              </div>
              <div className="context-tabs tabs">
                  <RaisedButton aria-label="Context" className="context-tab tab" ng-click="show_lemma_panel($event)">
                      Context
                      <i className="mdi mdi-chevron-right"></i>
                  </RaisedButton>
              </div>
          </article>
          <div className="discussion-wrap">
          </div>
      </div>


     );
   }

});
