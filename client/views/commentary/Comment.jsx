
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
        <article className="comment commentary-comment paper-shadow " data-id="{comment.id}" data-commentator-id="{comment.commentator.id}" layout="column">
            <div className="comment-fixed-title-wrap paper-shadow">
                <h3 className="comment-fixed-title">{comment.selected_revision.title}:</h3>
                <p className="comment-fixed-lemma lemma-text" ng-bind-html="comment_group.selected_edition
                .lines[0].html">&nbsp;<span className="fixed-title-lemma-ellipsis"
                                       ng-show="comment_group.selected_edition.lemma.length > 1">&hellip;</span></p>
                <a href="/author" ><span className="comment-author-name">{comment.commentator.name}</span></a>

            </div>

            <div className="comment-upper">

                <div className="comment-upper-left">
                    <h1 className="comment-title">{comment.selected_revision.title}</h1>
                    <div className="comment-topics">
                        <RaisedButton aria-label="Topic {topic.title}" ui-sref="search" className="comment-topic paper-shadow"
                                   ng-repeat="topic in comment.topics"
                                   onClick="add_search_term($event, 'topic')"
                                   data-id="{topic.id}" data-text="{topic.topic}">{topic.title}</RaisedButton>
                    </div>
                </div>

                <div className="comment-upper-right">
                    <div className="comment-author">
                        <div className="comment-author-text">
                            <a href="/commentator/show/{comment.commentator.id}" >
                                <span className="comment-author-name">{comment.commentator.name}</span>
                            </a>
                            <span className="comment-date">{comment.revisions}</span>
                        </div>
                        <div className="comment-author-image-wrap paper-shadow">
                            <a href="/commentator/show/{comment.commentator.id}" >

                                <img ng-src="/assets/{comment.commentator.thumbnail}" ng-show="comment.commentator.thumbnail.length"/>
                                <img ng-src="/assets/default_user.jpg" ng-hide="comment.commentator.thumbnail.length"/>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
            <div className="comment-lower">
                <div className="comment-body" onClick="load_lemma_reference($event)" ng-bind-html="to_trusted(comment.selected_revision.text)">
                </div>
                <div className="comment-reference" ng-show="comment.reference">
                    <h4>Secondary Source(s):</h4>
                    <p>
                        <a href="{comment.referenceLink}" target="_blank" ng-show="comment.referenceLink">{comment.reference}</a>
                        <span ng-show="!comment.referenceLink">{comment.reference}</span>
                    </p>
                </div>
            </div>
            <div className="comment-revisions">
                <RaisedButton aria-label="Revision {revision.updated | amDateFormat:'DD MMMM YYYY'}" data-id="{revision.id}" className="revision" ng-className="{'selected-revision':$last}"
                           ng-repeat="revision in comment.revisions" onClick="select_revision( $event )">
                    Revision {revision.updated}
                </RaisedButton>
            </div>

        </article>

     );
   }

});
