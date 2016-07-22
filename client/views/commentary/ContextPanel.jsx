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
      <div className="lemma-panel paper-shadow">

        <RaisedButton aria-label="Hide lemma panel" className="close-lemma-panel mdi mdi-close paper-shadow" ng-click="hide_lemma_panel($event)"></RaisedButton>

        <div className="lemma-text-wrap">
            <div ng-className="line.highlighted ? 'lemma-line highlighted' : 'lemma-line'"
                 ng-repeat="line in lemma_text.selected_edition.lines"
                 data-line_n="{line.n}">

                <div className="lemma-meta">
                    <span className="lemma-line-n" ng-show="(line.n % 5) === 0">
                        {line.n}
                    </span>
                </div>

                <div className="lemma-text">
                    {line.text}
                </div>


            </div>

            <div className="lemma-load" >
                <div className="lemma-spinner"></div>

            </div>

        </div>

        <div className="edition-tabs tabs">
            <RaisedButton data-edition="{edition.title}" aria-label="Toggle edition {edition.title}" className="edition-tab tab" ng-className="{'selected-edition-tab':$first}" ng-click="toggle_edition($event)" ng-repeat="edition in lemma_text.editions">
                {edition.title}
            </RaisedButton>
        </div>
        <div className="meta-tabs tabs">
            <RaisedButton aria-label="Toggle highlighting" className="edition-tab tab" ng-click="toggle_highlighting($event)">
                Highlighting
            </RaisedButton>
            <RaisedButton aria-label="Toggle scansion" className="edition-tab tab" ng-click="toggle_scansion($event)">
                Scansion
            </RaisedButton>
        </div>
    </div>


   );
  }

});
