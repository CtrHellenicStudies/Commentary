import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

CommentLemmnaSelect = React.createClass({

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired,
    },

    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },

    propTypes: {
        workSlug: React.PropTypes.string.isRequired,
        subwork_n: React.PropTypes.number.isRequired,
        selectedLineFrom: React.PropTypes.number.isRequired,
        selectedLineTo: React.PropTypes.number.isRequired,
        openContextReader: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            selectedLemmaEdition : "",
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
                'subwork.n': this.props.subwork_n,
                'text.n': {
                    $gte: this.props.selectedLineFrom,
                    $lte: this.props.selectedLineTo
                }
            };
        } else {
            lemmaQuery = {
                'work.slug': this.props.workSlug,
                'subwork.n': this.props.subwork_n,
                'text.n': {
                    $gte: this.props.selectedLineFrom,
                    $lte: this.props.selectedLineFrom,
                }
            };
        };

        var textNodesSubscription = Meteor.subscribe('textNodes', lemmaQuery);
        if (textNodesSubscription.ready()) {
            //console.log("Context Panel lemmaQuery", lemmaQuery);
            var textNodes = TextNodes.find(lemmaQuery).fetch();
            console.log('textNodes', textNodes);
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
            console.log('lemmaText',lemmaText);

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

        //console.log("Context Panel lemmaText", lemmaText);


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

    render() {
        var self = this;

        return (
            <div className="comment-outer comment-lemma-comment-outer">

                {this.props.selectedLineFrom > 0 ?
                    <article className="comment lemma-comment paper-shadow">

                        {this.data.selectedLemmaEdition.lines.map(function(line, i){
                            console.log('line', line);
                            return <div>
                                <p
                                    key={i}
                                    className="lemma-text"
                                    dangerouslySetInnerHTML={{ __html: line.html}}
                                ></p></div>

                        })}

                        <div className="edition-tabs tabs">
                            {this.data.lemmaText.map(function(lemmaTextEdition, i){
                                let lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

                                return <div>
                                    <RaisedButton
                                        key={i}
                                        label={lemmaEditionTitle}
                                        data-edition={lemmaTextEdition.title}
                                        className={self.data.selectedLemmaEdition.slug ===  lemmaTextEdition.slug ? "edition-tab tab selected-edition-tab" : "edition-tab tab"}
                                        onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
                                    /></div>

                            })}
                        </div>

                        <div className="context-tabs tabs">

                            <RaisedButton
                                className="context-tab tab"
                                onClick={this.props.openContextReader}
                                label="Context"
                                labelPosition="before"
                                icon={<FontIcon className="mdi mdi-chevron-right" />}
                            />

                        </div>

                    </article>
                :
                    
                    <article className="comment lemma-comment paper-shadow">
                        <p className="lemma-text">No line selected</p>
                        <div className="context-tabs tabs">
                            <RaisedButton
                                className="context-tab tab"
                                onClick={this.props.openContextReader}
                                label="Context"
                                labelPosition="before"
                                icon={<FontIcon className="mdi mdi-chevron-right" />}
                                >
                            </RaisedButton>
                        </div>
                    </article>
                }

            </div>
        );
    }
});
