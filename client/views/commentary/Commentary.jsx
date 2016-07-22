import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';


Commentary = React.createClass({

  propTypes: {
  },

  getInitialState(){
    return {
    }

  },


  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired,
  },


  render() {

    return (
            <div data-ng-controller="CommentaryController as c" className="commentary-primary content ">


              <div className="comment-group " ng-repeat="comment_group in commentary" layout="column" data-ref="{comment_group.ref}">
                  <div className="comments" layout="column" layout-align="center top">

                      <CommentLemma />

                      <div className="comment-outer has-discussion " ng-repeat="comment in comment_group.comments">

                          <CommentDetail />

                          <CommentDiscussion />


                      </div> {/*<!-- .comment-outer -->*/}


                  </div> {/*<!-- .comments -->*/}

                  <hr className="comment-group-end"/>

              </div> {/*<!-- .comment-group -->*/}


              <div className="ahcip-spinner commentary-loading" infinite-scroll="infinite_scroll()" infinite-scroll-distance="3" ng-hide="is_homepage || no_commentary || no_more_commentary" >
                  <div className="double-bounce1"></div>
                  <div className="double-bounce2"></div>

              </div>  {/*<!-- .spinner -->*/}
              <div className="no-commentary-wrap">
                <p className="no-commentary no-results" ng-show="no_commentary">
                  No commentary available for the current search.
                </p>

              </div> {/*<!-- .read-more-link -->*/}
              <div className="read-more-link">
                  <RaisedButton href="/commentary/"  className="cover-link primary show-more paper-shadow" ng-show="is_homepage">
                      Continue reading
                  </RaisedButton>

              </div>{/*<!-- .read-more-link -->*/}

              <div className="lemma-reference-modal">
                  <article className="comment  lemma-comment paper-shadow " layout="column">
                      <p className="lemma-text" ng-repeat="lemma in lemma_reference_modal.selected_edition.lines" ng-bind="lemma.html"></p>
                      <div className="edition-tabs tabs">
                          <RaisedButton data-edition="{edition.title}" aria-label="Edition {edition.title}" className="edition-tab tab" ng-className="{'selected-edition-tab paper-shadow':$first}" ng-click="toggle_edition_lemma_reference_modal($event)" ng-repeat="edition in lemma_reference_modal.editions">
                              {edition.title}
                          </RaisedButton>
                      </div>
                      <i className="mdi mdi-close paper-shadow" ng-click="hide_lemma_reference($event)">
                      </i>
                  </article>

              </div>{/*<!-- .lemma-reference-modal -->*/}


            {/*<!-- .commentary-primary -->*/}
          </div>
     );
   }

});
