import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

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
        initWorkSlug: React.PropTypes.string.isRequired,
        initSubwork_n: React.PropTypes.number.isRequired,
        initLineFrom: React.PropTypes.number.isRequired,
        initLineTo: React.PropTypes.number.isRequired,
        // commentGroup: React.PropTypes.object.isRequired,
        // closeContextPanel: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        return {
            workSlug: this.props.initWorkSlug,
            subwork_n: this.props.initSubwork_n,
            lineFrom: this.props.initLineFrom,
            lineTo: this.props.initLineTo,
        };
    },

	// componentDidUpdate(prevProps, prevState) {
	//       this.checkIfPropsChanged();
	//       this.checkIfStateChanged();
	// },


    mixins: [ReactMeteorData],

    getMeteorData() {

        var lemmaText = [];
        // var commentGroup = this.props.commentGroup;
        var selectedLemmaEdition = {
            lines: [],
            slug: ""
        };

        var lemmaQuery = {
            'work.slug': this.state.workSlug,
            'subwork.n': this.state.subwork_n,
            'text.n': {
                $gte: this.state.lineFrom,
                // $lte: this.props.lineFrom + 49
                $lte: this.state.lineTo
            }
        };

        console.log('lemmaQuery', lemmaQuery);

        var handle2 = Meteor.subscribe('textNodes', lemmaQuery);
        // if (handle2.ready()) {
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

            // if (this.state.selectedLemmaEdition.length) {
            //     lemmaText.forEach(function(edition) {
            //         if (edition.slug === this.state.selectedLemmaEdition) {
            //             selectedLemmaEdition = edition;
            //         }
            //     });
            // } else {
            //     selectedLemmaEdition = lemmaText[0];
            // }

        // }

        //console.log("Context Panel lemmaText", lemmaText);




        return {
            lemmaText: lemmaText,
            // selectedLemmaEdition: selectedLemmaEdition
        };


    },

 //    toggleEdition(editionSlug){
	// 	if(this.state.selectedLemmaEdition !== editionSlug){
	// 		this.setState({
	// 			selectedLemmaEdition: editionSlug
	// 		});

	// 	}

	// },


  render() {
		var self = this;
		var contextPanelStyles = "lemma-panel paper-shadow";

		// if(this.props.open){
			contextPanelStyles += " extended";
		// }

    return (
      <div className={contextPanelStyles}>

        <div className="lemma-text-wrap">
          {this.data.lemmaText.length > 0 ?
          	this.data.lemmaText[0].lines.map(function(line, i){
						var lineClass="lemma-line";

            return <div
							className={lineClass}
							key={i}>

                <div className="lemma-meta">
                  {(line.n % 5 === 0) ?
                    <span className="lemma-line-n" >
                        {line.n}
                    </span>
                  : ""
                  }
                </div>

                <div className="lemma-text" dangerouslySetInnerHTML={{__html: line.html}} >
                </div>


            </div>

          })
          	:
          	''}

            <div className="lemma-load" >
                <div className="lemma-spinner"></div>

            </div>

        </div>

    </div>


   );
  }

});
