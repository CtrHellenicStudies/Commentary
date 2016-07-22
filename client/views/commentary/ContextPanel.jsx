import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';

ContextPanel = React.createClass({

  propTypes: {
  },

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object.isRequired
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

        <RaisedButton aria-label="Hide lemma panel" class="close-lemma-panel mdi mdi-close paper-shadow" ng-click="hide_lemma_panel($event)"></RaisedButton>

        <div class="lemma-text-wrap">
            <div ng-class="line.highlighted ? 'lemma-line highlighted' : 'lemma-line'"
                 ng-repeat="line in lemma_text.selected_edition.lines"
                 data-line_n="{line.n}">

                <div class="lemma-meta">
                    <span class="lemma-line-n" ng-show="(line.n % 5) === 0">
                        {line.n}
                    </span>
                </div>

                <div class="lemma-text">
                    {line.text}
                </div>


            </div>

            <div class="lemma-load" >
                <div class="lemma-spinner"></div>

            </div>

        </div>

        <div class="edition-tabs tabs">
            <RaisedButton data-edition="{edition.title}" aria-label="Toggle edition {edition.title}" class="edition-tab tab" ng-class="{'selected-edition-tab':$first}" ng-click="toggle_edition($event)" ng-repeat="edition in lemma_text.editions">
                {edition.title}
            </RaisedButton>
        </div>
        <div class="meta-tabs tabs">
            <RaisedButton aria-label="Toggle highlighting" class="edition-tab tab" ng-click="toggle_highlighting($event)">
                Highlighting
            </RaisedButton>
            <RaisedButton aria-label="Toggle scansion" class="edition-tab tab" ng-click="toggle_scansion($event)">
                Scansion
            </RaisedButton>
        </div>
    </div>


   );
  }

});
