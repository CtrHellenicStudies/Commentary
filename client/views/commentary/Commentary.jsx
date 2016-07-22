
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
            <div data-ng-controller="CommentaryController as c" class="commentary-primary content ">


              <div class="comment-group " ng-repeat="comment_group in commentary" layout="column" data-ref="{comment_group.ref}">
                  <div class="comments" layout="column" layout-align="center top">

                      <CommentLemma />

                      <div class="comment-outer has-discussion " ng-repeat="comment in comment_group.comments">

                          <CommentDetail />

                          <CommentDiscussion />


                      </div> {/*<!-- .comment-outer -->*/}


                  </div> {/*<!-- .comments -->*/}

                  <hr class="comment-group-end">

              </div> {/*<!-- .comment-group -->*/}


              <div class="ahcip-spinner commentary-loading" infinite-scroll="infinite_scroll()" infinite-scroll-distance="3" ng-hide="is_homepage || no_commentary || no_more_commentary" >
                  <div class="double-bounce1"></div>
                  <div class="double-bounce2"></div>

              </div>  {/*<!-- .spinner -->*/}
              <div class="no-commentary-wrap">
                <p class="no-commentary no-results" ng-show="no_commentary">
                  No commentary available for the current search.
                </p>

              </div> {/*<!-- .read-more-link -->*/}
              <div class="read-more-link">
                  <RaisedButton href="/commentary/"  class="cover-link primary show-more paper-shadow" ng-show="is_homepage">
                      Continue reading
                  </RaisedButton>

              </div>{/*<!-- .read-more-link -->*/}

              <div class="lemma-reference-modal">
                  <article class="comment  lemma-comment paper-shadow " layout="column">
                      <p class="lemma-text" ng-repeat="lemma in lemma_reference_modal.selected_edition.lines" ng-bind="lemma.html"></p>
                      <div class="edition-tabs tabs">
                          <RaisedButton data-edition="{edition.title}" aria-label="Edition {edition.title}" class="edition-tab tab" ng-class="{'selected-edition-tab paper-shadow':$first}" ng-click="toggle_edition_lemma_reference_modal($event)" ng-repeat="edition in lemma_reference_modal.editions">
                              {edition.title}
                          </RaisedButton>
                      </div>
                      <i class="mdi mdi-close paper-shadow" ng-click="hide_lemma_reference($event)">
                      </i>
                  </article>

              </div>{/*<!-- .lemma-reference-modal -->*/}



          </div>{/*<!-- .commentary-primary -->*/}
     );
   }

});
