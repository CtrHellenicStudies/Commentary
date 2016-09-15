import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import InfiniteScroll from '../../../imports/InfiniteScroll';
import { ReactiveVar } from 'meteor/reactive-var'

ContextReader = React.createClass({

    getChildContext() {
        return {
            muiTheme: getMuiTheme(baseTheme)
        };
    },

    childContextTypes: {
        muiTheme: React.PropTypes.object.isRequired
    },

    propTypes: {
        workSlug: React.PropTypes.string.isRequired,
        subwork_n: React.PropTypes.number.isRequired,
        // initLineFrom: React.PropTypes.number.isRequired,
        // initLineTo: React.PropTypes.number.isRequired,
        // initHighlightLineFrom: React.PropTypes.number,
        // initHighlightLineTo: React.PropTypes.number,
        // commentGroup: React.PropTypes.object.isRequired,
        // closeContextPanel: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            lineFrom: 1,
            lineTo: 50,
            selectedLemmaEdition : "",
        };
    },

	// componentDidUpdate(prevProps, prevState) {
 //        this.checkIfPropsChanged();
 //        this.checkIfStateChanged();

	// },


    mixins: [ReactMeteorData],

    getMeteorData() {

        var that = this;

        var lemmaText = [];
        // var commentGroup = this.props.commentGroup;
        var selectedLemmaEdition = {
            lines: [],
            slug: ""
        };

        var lemmaQuery = {
            'work.slug': this.props.workSlug,
            'subwork.n': this.props.subwork_n,
            'text.n': {
                $gte: this.state.lineFrom,
                $lte: this.state.lineTo
            }
        };

        var textNodesSubscription = Meteor.subscribe('textNodes', lemmaQuery);
        if (textNodesSubscription.ready()) {
            //console.log("Context Panel lemmaQuery", lemmaQuery);
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

    handeLineMouseOver(event) {
        console.log('event', event);
    },

    render() {
		var self = this;
		var contextPanelStyles = "lemma-panel paper-shadow";

		// if(this.props.open){
			contextPanelStyles += " extended";
		// }

        return (
          <div className={contextPanelStyles}>

            <div className="lemma-text-wrap">
                {this.data.selectedLemmaEdition.lines.map(function(line, i){
                    var lineClass="lemma-line";

                    return <div className={lineClass} key={i} onMouseOver={self.handeLineMouseOver}>

                        <div className="lemma-meta">
                            {(line.n % 5 === 0) ?
                                <span className="lemma-line-n">
                                    {line.n}
                                </span>
                            : ""}
                        </div>

                        <div className="lemma-text" dangerouslySetInnerHTML={{__html: line.html}} >
                        </div>

                    </div>

                })}

                <div className="read-more-link">
                    <RaisedButton
                        className="cover-link light show-more "
                        label="Read More"
                        onClick={this.readMoreClicked}
                    />
                </div>

            </div>

            <div className="edition-tabs tabs">
                {this.data.lemmaText.map(function(lemmaTextEdition, i){
                    let lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);
                    
                    return (
                        <RaisedButton
                            key={i}
                            label={lemmaEditionTitle}
                            data-edition={lemmaTextEdition.title}
                            className={self.data.selectedLemmaEdition.slug ===  lemmaTextEdition.slug ? "edition-tab tab selected-edition-tab" : "edition-tab tab"}
                            onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
                        />
                    );

                })}

            </div>

        </div>

        );
    }

});
