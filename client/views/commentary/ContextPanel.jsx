import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

ContextPanel = React.createClass({

  propTypes: {
    open: React.PropTypes.bool.isRequired,
    closeContextPanel: React.PropTypes.func.isRequired,
    selectedLemmaEdition: React.PropTypes.object,
    lemmaText: React.PropTypes.array,
    toggleLemmaEdition: React.PropTypes.func,
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


  render() {
    return (
      <div className="lemma-panel paper-shadow">

				<IconButton
          className="close-lemma-panel"
          onClick={this.props.closeContextPanel}
          iconClassName="mdi mdi-close"
          >

				</IconButton>

        <div className="lemma-text-wrap">
          {this.props.selectedLemmaEdition.lines.map(function(line){
            return <div data-line_n="{line.n}">

                <div className="lemma-meta">
                  {(line.n % 5 === 0) ?
                    <span className="lemma-line-n" >
                        {line.n}
                    </span>
                  : ""
                  }
                </div>

                <div className="lemma-text">
                    {line.text}
                </div>


            </div>

          })}

            <div className="lemma-load" >
                <div className="lemma-spinner"></div>

            </div>

        </div>

        <div className="edition-tabs tabs">
          {this.props.lemmaText.map(function(lemma_text_edition){

            return <FlatButton
                      label={edition.title}
                      data-edition={edition.title}
                      className="edition-tab tab"
                      onClick={this.toggleLemmaEdition}
                      >
                  </FlatButton>

          })}

        </div>

        <div className="meta-tabs tabs">
            <FlatButton
                label="Highlighting"
                className="edition-tab tab"
                onClick={this.toggleHighlighting}
                >
            </FlatButton>
            <FlatButton
                label="Scansion"
                className="edition-tab tab"
                onClick={this.toggleScansion}
                >
            </FlatButton>
        </div>
    </div>


   );
  }

});
