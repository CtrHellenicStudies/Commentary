
import RaisedButton from 'material-ui/RaisedButton';

Comment = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired
  },

  getInitialState(){
    return {
    }

  },

  render() {
    
    return (
        <article class="comment commentary-comment paper-shadow " data-id="{comment.id}" data-commentator-id="{comment.commentator.id}" layout="column">
            <div class="comment-fixed-title-wrap paper-shadow">
                <h3 class="comment-fixed-title">{comment.selected_revision.title}:</h3>
                <p class="comment-fixed-lemma lemma-text" ng-bind-html="comment_group.selected_edition
                .lines[0].html">&nbsp;<span class="fixed-title-lemma-ellipsis"
                                       ng-show="comment_group.selected_edition.lemma.length > 1">&hellip;</span></p>
                <a href="/author" ><span class="comment-author-name">{comment.commentator.name}</span></a>

            </div>

            <div class="comment-upper">

                <div class="comment-upper-left">
                    <h1 class="comment-title">{comment.selected_revision.title}</h1>
                    <div class="comment-topics">
                        <RaisedButton aria-label="Topic {topic.title}" ui-sref="search" class="comment-topic paper-shadow"
                                   ng-repeat="topic in comment.topics"
                                   ng-click="add_search_term($event, 'topic')"
                                   data-id="{topic.id}" data-text="{topic.topic}">{topic.title}</RaisedButton>
                    </div>
                </div>

                <div class="comment-upper-right">
                    <div class="comment-author">
                        <div class="comment-author-text">
                            <a href="/commentator/show/{comment.commentator.id}" >
                                <span class="comment-author-name">{comment.commentator.name}</span>
                            </a>
                            <span class="comment-date">{comment.revisions[ comment.revisions.length - 1 ]
                            .updated | amDateFormat:'DD MMMM YYYY' }</span>
                        </div>
                        <div class="comment-author-image-wrap paper-shadow">
                            <a href="/commentator/show/{comment.commentator.id}" >

                                <img ng-src="/assets/{comment.commentator.thumbnail}" ng-show="comment.commentator.thumbnail.length">
                                <img ng-src="/assets/default_user.jpg" ng-hide="comment.commentator.thumbnail.length">
                            </a>
                        </div>
                    </div>
                </div>

            </div>
            <div class="comment-lower">
                <div class="comment-body" ng-click="load_lemma_reference($event)" ng-bind-html="to_trusted(comment.selected_revision.text)">
                </div>
                <div class="comment-reference" ng-show="comment.reference">
                    <h4>Secondary Source(s):</h4>
                    <p>
                        <a href="{comment.referenceLink}" target="_blank" ng-show="comment.referenceLink">{comment.reference}</a>
                        <span ng-show="!comment.referenceLink">{comment.reference}</span>
                    </p>
                </div>
            </div>
            <div class="comment-revisions">
                <RaisedButton aria-label="Revision {revision.updated | amDateFormat:'DD MMMM YYYY'}" data-id="{revision.id}" class="revision" ng-class="{'selected-revision':$last}"
                           ng-repeat="revision in comment.revisions" ng-click="select_revision( $event )">
                    Revision {revision.updated | amDateFormat:'DD MMMM YYYY' }
                </RaisedButton>
            </div>

        </article>

     );
   }

});
