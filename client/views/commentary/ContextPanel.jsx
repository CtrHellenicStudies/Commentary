import FlatButton from 'material-ui/FlatButton';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

CommentaryPanel = React.createClass({

  propTypes: {
  },

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },

  getDefaultProps() {
    return {
      toggleCommentary: false,
      toggleTranslations: false
    };
  },

  mixins: [ReactMeteorData],

  getMeteorData(){

    return {

    };


  },

  getInitialState(){

  },

  render() {
    return (
      <div class="lemma-panel paper-shadow">

        <md-button aria-label="Hide lemma panel" class="close-lemma-panel mdi mdi-close paper-shadow" ng-click="hide_lemma_panel($event)"></md-button>

        <div class="lemma-text-wrap">
            <div ng-class="line.highlighted ? 'lemma-line highlighted' : 'lemma-line'"
                 ng-repeat="line in lemma_text.selected_edition.lines"
                 data-line_n="{{line.n}}">

                <div class="lemma-meta">
                    <span class="lemma-line-n" ng-show="(line.n % 5) === 0">
                        {{line.n}}
                    </span>
                </div>

                <div class="lemma-text">
                    {{line.text}}
                </div>


            </div>

            <div class="lemma-load" >
                <div class="lemma-spinner"></div>

            </div>

        </div>

        <div class="edition-tabs tabs">
            <md-button data-edition="{{edition.title}}" aria-label="Toggle edition {{edition.title}}" class="edition-tab tab" ng-class="{'selected-edition-tab':$first}" ng-click="toggle_edition($event)" ng-repeat="edition in lemma_text.editions">
                {{edition.title}}
            </md-button>
        </div>
        <div class="meta-tabs tabs">
            <md-button aria-label="Toggle highlighting" class="edition-tab tab" ng-click="toggle_highlighting($event)">
                Highlighting
            </md-button>
            <md-button aria-label="Toggle scansion" class="edition-tab tab" ng-click="toggle_scansion($event)">
                Scansion
            </md-button>
        </div>
    </div>


   );
  }

});
CommentaryPanel.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired
};
