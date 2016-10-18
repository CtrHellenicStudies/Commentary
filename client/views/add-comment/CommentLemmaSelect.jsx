import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

CommentLemmaSelect = React.createClass({

    propTypes: {
      workSlug: React.PropTypes.string.isRequired,
      subworkN: React.PropTypes.number.isRequired,
      selectedLineFrom: React.PropTypes.number.isRequired,
      selectedLineTo: React.PropTypes.number.isRequired,
    },

    childContextTypes: {
      muiTheme: React.PropTypes.object.isRequired,
    },

    getChildContext() {
      return {muiTheme: getMuiTheme(baseTheme)};
    },

    getInitialState() {
      return {
          selectedLemmaEdition : "",
          lineLetterValue: "",
      };
    },

    mixins: [ReactMeteorData],

    getMeteorData() {

        var that = this;

        var lemmaText = [];
        // var commentGroup = this.props.commentGroup;
        var selectedLemmaEdition = {
            lines: [],
            slug: ""
        };
        var lemmaQuery = {};
        if (this.props.selectedLineFrom <= this.props.selectedLineTo) {
            lemmaQuery = {
                'work.slug': this.props.workSlug,
                'subwork.n': this.props.subworkN,
                'text.n': {
                    $gte: this.props.selectedLineFrom,
                    $lte: this.props.selectedLineTo
                }
            };
        } else {
            lemmaQuery = {
                'work.slug': this.props.workSlug,
                'subwork.n': this.props.subworkN,
                'text.n': {
                    $gte: this.props.selectedLineFrom,
                    $lte: this.props.selectedLineFrom,
                }
            };
        };

        var textNodesSubscription = Meteor.subscribe('textNodes', lemmaQuery);
        if (textNodesSubscription.ready()) {
            var textNodes = TextNodes.find(lemmaQuery).fetch();
            var editions = [];

            var textIsInEdition = false;
            textNodes.forEach(function(textNode) {

                textNode.text.forEach(function(text) {
                    textIsInEdition = false;

                    editions.forEach(function(edition) {

                        if (text.edition.slug === edition.slug) {
                            edition.lines.push({
                                html: text.html,
                                n: text.n
                            });
                            textIsInEdition = true;
                        }
                    })

                    if (!textIsInEdition) {
                        editions.push({
                            title: text.edition.title,
                            slug: text.edition.slug,
                            lines: [{
                                html: text.html,
                                n: text.n
                            }],
                        })
                    }
                });
            });

            lemmaText = editions;

            if (this.state.selectedLemmaEdition.length) {
                lemmaText.forEach(function(edition) {
                    if (edition.slug === that.state.selectedLemmaEdition) {
                        selectedLemmaEdition = edition;
                    }
                });
            } else {
                selectedLemmaEdition = lemmaText[0];
            }

        }

        return {
            lemmaText: lemmaText,
            selectedLemmaEdition: selectedLemmaEdition
        };

    },

    toggleEdition(editionSlug) {
        if (this.state.selectedLemmaEdition !== editionSlug) {
            this.setState({
                selectedLemmaEdition: editionSlug
            });
        }
    },

    onLineLetterValueChange(event) {
        this.setState({
            lineLetterValue: event.target.value,
        });
    },

    render() {
        var self = this;

        return (
					<div className="comments lemma-panel-visible">
            <div className="comment-outer comment-lemma-comment-outer">

                {this.props.selectedLineFrom > 0 ?
                    <article className="comment lemma-comment paper-shadow">

                        {this.data.selectedLemmaEdition.lines.map(function(line, i){
                            return (
                                <p
                                    key={i}
                                    className="lemma-text"
                                    dangerouslySetInnerHTML={{ __html: line.html}}
                                ></p> );

                        })}

                        {self.props.selectedLineTo === 0 ?
                            <div>
                                <TextField
                                    name="lineLetter"
                                    id="lineLetter"
                                    required={false}
                                    floatingLabelText="Line letter..."
                                    value={this.state.lineLetterValue}
                                    onChange={this.onLineLetterValueChange}
                                />
                            </div>
                            :
                            ""
                        }

                        <div className="edition-tabs tabs">
                            {this.data.lemmaText.map(function(lemmaTextEdition, i){
                                let lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

                                return (<RaisedButton
                                        key={i}
                                        label={lemmaEditionTitle}
                                        data-edition={lemmaTextEdition.title}
                                        className={self.data.selectedLemmaEdition.slug ===  lemmaTextEdition.slug ? "edition-tab tab selected-edition-tab" : "edition-tab tab"}
                                        onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
                                    >
                                    </RaisedButton>);

                            })}
                        </div>

                        <div className="context-tabs tabs">

                            {/* <RaisedButton
                                className="context-tab tab"
                                onClick={this.props.openContextReader}
                                label="Context"
                                labelPosition="before"
                                icon={<FontIcon className="mdi mdi-chevron-right" />}
                            /> */}

                        </div>

                    </article>
                :

                    <article className="comment lemma-comment paper-shadow">
                        <p className="lemma-text no-lines-selected">No line(s) selected</p>
                        {/*<div className="context-tabs tabs">
                            <RaisedButton
                                className="context-tab tab"
                                onClick={this.props.openContextReader}
                                label="Context"
                                labelPosition="before"
                                icon={<FontIcon className="mdi mdi-chevron-right" />}
                                >
                            </RaisedButton>
                        </div>*/}
                    </article>
                }

            </div>
					</div>
        );
    }
});
