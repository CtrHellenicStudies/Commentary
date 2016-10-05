import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
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
				open: React.PropTypes.bool.isRequired,

				workSlug: React.PropTypes.string.isRequired,
				subwork_n: React.PropTypes.number.isRequired,
				selectedLineFrom: React.PropTypes.number.isRequired,
				selectedLineTo: React.PropTypes.number.isRequired,
				updateSelecetedLines: React.PropTypes.func,
				initialLineFrom: React.PropTypes.number,
				initialLineTo: React.PropTypes.number,
				disableEdit: React.PropTypes.bool,
		},

		getInitialState() {
			var lineFrom = 1,
				lineTo = 50;
			if(this.props.initialLineFrom) {
				lineFrom = this.props.initialLineFrom
			};
			if(this.props.initialLineTo) {
				lineTo = this.props.initialLineTo
			};
			return {
				lineFrom: lineFrom,
				lineTo: lineTo,
				selectedLemmaEdition : "",
				maxLine: 0,
				linePagination: [],
			};
		},

    componentDidUpdate(prevProps, prevState) {
        var lineFrom = this.state.lineFrom,
            lineTo = this.state.lineTo;
        if (Object.keys(this.refs).length) {
            if (this.props.selectedLineFrom === 0) {
                for (var i = lineFrom; i <= lineTo; i++) {
                    this.refs[i.toString()].style.borderBottom = "1px solid #ffffff";
                };
            } else if (this.props.selectedLineTo === 0) {
                for (var i = lineFrom; i <= lineTo; i++) {
                    if (i === this.props.selectedLineFrom) {
                        this.refs[i.toString()].style.borderBottom = "1px solid #d59518";
                    } else {
                        this.refs[i.toString()].style.borderBottom = "1px solid #ffffff";
                    };
                };
            } else {
                for (var i = lineFrom; i <= lineTo; i++) {
                    if (i >= this.props.selectedLineFrom && i <= this.props.selectedLineTo) {
                        this.refs[i.toString()].style.borderBottom = "1px solid #d59518";
                    } else {
                        this.refs[i.toString()].style.borderBottom = "1px solid #ffffff";
                    };
                };
            };
        };

        if (this.props.workSlug != "" && this.props.subwork_n != 0 && (prevProps.workSlug != this.props.workSlug || prevProps.subwork_n != this.props.subwork_n)) {
            Meteor.call('getMaxLine', this.props.workSlug, this.props.subwork_n, (err, res) => {
                if (err) {
                    console.log(err);
                } else if (res) {
                	var linePagination = [];
                	for (var i = 1; i <= res; i+=100) {
                		linePagination.push(i);
                	};
                    this.setState({
                    	linePagination: linePagination,
                    	maxLine: res,
                    });
                }
            });
        };
    },

    componentDidMount() {
        if (this.props.workSlug && this.props.subwork_n) {
            Meteor.call('getMaxLine', this.props.workSlug, this.props.subwork_n, (err, res) => {
                if (err) {
                    console.log(err);
                } else if (res) {
                    var linePagination = [];
                    for (var i = 1; i <= res; i += 100) {
                        linePagination.push(i);
                    };
                    this.setState({
                        linePagination: linePagination,
                        maxLine: res,
                    });
                }
            });
        };
    },

	mixins: [ReactMeteorData],

    getMeteorData() {

        var that = this;

        if (this.props.workSlug != "" && this.props.subwork_n != 0) {

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
                var textNodes = TextNodes.find(lemmaQuery, {sort:{'text.n':1}}).fetch();
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
                // console.log('lemmaText',lemmaText);

                if (this.state.selectedLemmaEdition.length) {
                    lemmaText.forEach(function(edition) {
                        if (edition.slug === that.state.selectedLemmaEdition) {
                            selectedLemmaEdition = edition;
                        }
                    });
                } else {
                    selectedLemmaEdition = lemmaText[0];
                };

            }

            return {
                lemmaText: lemmaText,
                selectedLemmaEdition: selectedLemmaEdition
            };
        } else {
            return {
                lemmaText: "",
                selectedLemmaEdition: ""
            };
        };
    },

		toggleEdition(editionSlug) {
				if (this.state.selectedLemmaEdition !== editionSlug) {
						this.setState({
								selectedLemmaEdition: editionSlug
						});
				}
		},

		handeLineMouseEnter(event) {
			if(!this.props.disableEdit) {
				var style = event.target.style;
				style.backgroundColor = "#d59518";
			};
		},

		handeLineMouseLeave(event) {
			if(!this.props.disableEdit) {
				var style = event.target.style;
				style.backgroundColor = "#ffffff";
			};
		},

		handleLineClick(event) {
			if(!this.props.disableEdit) {
				var target = event.target;
				var style = event.target.style;
				var id = parseInt(target.id);
				if (this.props.selectedLineFrom === 0) {
						this.props.updateSelecetedLines(id, null);
				} else if (id === this.props.selectedLineFrom && this.props.selectedLineTo === 0) {
						this.props.updateSelecetedLines(0, null);
				} else if (this.props.selectedLineTo === 0 && id > this.props.selectedLineFrom) {
						this.props.updateSelecetedLines(null, id);
				} else if (this.props.selectedLineTo === 0 && id < this.props.selectedLineFrom) {
						this.props.updateSelecetedLines(id, this.props.selectedLineFrom);
				} else {
						this.props.updateSelecetedLines(id, 0);
				};
			};
		},

    onAfterClicked() {
        if (this.state.lineTo <= this.state.maxLine) {
            this.setState({
                lineFrom: this.state.lineFrom + 25,
                lineTo: this.state.lineTo + 25,
            });
        };
    },

    onBeforeClicked() {
        if (this.state.lineFrom != 1) {
            this.setState({
                lineFrom: this.state.lineFrom - 25,
                lineTo: this.state.lineTo - 25,
            });
        };
    },

		linePaginationClicked(line) {
			this.setState({
				lineFrom: line,
				lineTo: line + 50,
			});
		},

		render() {
		var self = this;
		var contextPanelStyles = "lemma-panel paper-shadow";

		if(this.props.open){
			contextPanelStyles += " extended";
		}

		return (
				<div>
						{this.props.workSlug != "" && this.props.subwork_n != 0 ?

								<div className={contextPanelStyles}>

										<IconButton
												className="close-lemma-panel"
												onClick={this.props.closeContextPanel}
												iconClassName="mdi mdi-close"
										/>

										<div className="lemma-text-wrap">

												{this.state.linePagination.map(function(line, i){
													return (
														<RaisedButton
																key={i}
																label={line}
																className={"edition-tab tab"}
																onClick={self.linePaginationClicked.bind(null, line)}
														/>
														);
												})}

												<div className="before-link">
														<RaisedButton
																className="cover-link light"
																label="Before"
																onClick={this.onBeforeClicked}
																icon={<FontIcon className="mdi mdi-arrow-up" />}
														/>
												</div>
												{this.data.selectedLemmaEdition.lines.map(function(line, i){
														var lineClass="lemma-line";

														return <div className={lineClass} key={i}>

																<div className="lemma-meta">
																		{(line.n % 5 === 0) ?
																				<span className="lemma-line-n">
																						{line.n}
																				</span>
																		: ""}
																</div>

																<div 
																	className="lemma-text"
																	ref={line.n}
																	id={i+1}
																	dangerouslySetInnerHTML={{__html: line.html}}
																	onMouseEnter={self.handeLineMouseEnter}
																	onMouseLeave={self.handeLineMouseLeave}
																	onClick={self.handleLineClick}
																	style={{cursor: "pointer"}}>
																</div>

														</div>

												})}

												<div className="after-link">
														<RaisedButton
																className="cover-link light"
																label="After"
																onClick={this.onAfterClicked}
																icon={<FontIcon className="mdi mdi-arrow-down" />}
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
																		className={self.data.selectedLemmaEdition.slug ===	lemmaTextEdition.slug ? "edition-tab tab selected-edition-tab" : "edition-tab tab"}
																		onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
																/>
														);

												})}

										</div>

								</div>

						:
								<div className={contextPanelStyles}>
										<IconButton
												className="close-lemma-panel"
												onClick={this.props.closeContextPanel}
												iconClassName="mdi mdi-close"
										/>
										<div className="lemma-text-wrap">
												No work & book selected
										</div>
								</div>
						}

				</div>

				);
		}

});
