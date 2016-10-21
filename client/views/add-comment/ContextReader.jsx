import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import InfiniteScroll from '../../../imports/InfiniteScroll';
import { ReactiveVar } from 'meteor/reactive-var'

ContextReader = React.createClass({

		propTypes: {
				workSlug: React.PropTypes.string.isRequired,
				subworkN: React.PropTypes.number.isRequired,
				selectedLineFrom: React.PropTypes.number.isRequired,
				selectedLineTo: React.PropTypes.number.isRequired,
				updateSelectedLines: React.PropTypes.func,
				initialLineFrom: React.PropTypes.number,
				initialLineTo: React.PropTypes.number,
				disableEdit: React.PropTypes.bool,
		},

		getDefaultProps() {
			return {
				workSlug: 'iliad',
				subworkN: 1,

			};

		},

		childContextTypes: {
				muiTheme: React.PropTypes.object.isRequired
		},

		getChildContext() {
				return {
						muiTheme: getMuiTheme(baseTheme)
				};
		},

		getInitialState() {
			let lineFrom = 1,
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

        let lineFrom = this.state.lineFrom;
        let lineTo = this.state.lineTo;

				if(
						prevProps.initialLineFrom
					&& (prevProps.initialLineFrom !== this.props.initialLineFrom)
				) {
					lineFrom = this.props.initialLineFrom;
				}

				if(
						prevProps.initialLineTo
					&& (prevProps.initialLineTo !== this.props.initialLineTo)
				) {
					lineTo = this.props.initialLineTo;
				}

        if (
					this.props.workSlug != ""
					&& this.props.subwork_n != 0
					&& (
						prevProps.workSlug != this.props.workSlug
						|| prevProps.subwork_n != this.props.subwork_n
					)
				) {
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

        // incase a subwork has less lines then initial this.state.lineTo
        if (this.state.maxLine != 0 && this.state.maxLine < this.state.lineTo) {
            this.setState({
                lineTo: this.state.maxLine,
            });
        };

        if (Object.keys(this.refs).length) {
            if (this.props.selectedLineFrom === 0) {
                for (var i = lineFrom; i <= lineTo; i++) {
									if(i.toString() in this.refs) {
                    this.refs[i.toString()].style.borderBottom = "2px solid #ffffff";
									}
                };
            } else if (this.props.selectedLineTo === 0) {
                for (var i = lineFrom; i <= lineTo; i++) {
                    if (i === this.props.selectedLineFrom) {
                        this.refs[i.toString()].style.borderBottom = "2px solid #B2EBF2";
                    } else {
											if(i.toString() in this.refs) {
                        this.refs[i.toString()].style.borderBottom = "2px solid #ffffff";
											}
                    };
                };
            } else {
                for (var i = lineFrom; i <= lineTo; i++) {
                    if (i >= this.props.selectedLineFrom && i <= this.props.selectedLineTo) {
                        this.refs[i.toString()].style.borderBottom = "2px solid #B2EBF2";
                    } else {
											if(i.toString() in this.refs) {
                        this.refs[i.toString()].style.borderBottom = "2px solid #ffffff";
											}
                    };
                };
            };
        };

        if (
						this.props.workSlug != ""
					&& this.props.subworkN != 0
					&& (
							prevProps.workSlug != this.props.workSlug
						|| prevProps.subworkN != this.props.subworkN
						|| prevProps.initialLineTo != this.props.initialLineTo
						|| prevProps.initialLineFrom != this.props.initialLineFrom
					)
				) {
            Meteor.call('getMaxLine', this.props.workSlug, this.props.subworkN, (err, res) => {
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
											lineFrom: this.props.initialLineFrom,
											lineTo: this.props.initialLineTo,
                    });
                }
            });
        };
    },

    componentDidMount() {
      if (this.props.workSlug && this.props.subworkN) {
        Meteor.call('getMaxLine', this.props.workSlug, this.props.subworkN, (err, res) => {
          if (err) {
            console.log(err);
          } else if (res) {
            const linePagination = [];
            for (let i = 1; i <= res; i += 100) {
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

      var self = this;

      if (this.props.workSlug != "" && this.props.subworkN != 0) {

          let lemmaText = [];
          // var commentGroup = this.props.commentGroup;
          let selectedLemmaEdition = {
              lines: [],
              slug: ""
          };

          const lemmaQuery = {
              'work.slug': this.props.workSlug,
              'subwork.n': this.props.subworkN,
              'text.n': {
                  $gte: this.state.lineFrom,
                  $lte: this.state.lineTo
              }
          };

					// console.log('lemmaQuery', lemmaQuery);


          const textNodesSubscription = Meteor.subscribe('textNodes', lemmaQuery);
          if (textNodesSubscription.ready()) {
              //console.log("Context Panel lemmaQuery", lemmaQuery);
              const textNodes = TextNodes.find(lemmaQuery, {sort:{'text.n':1}}).fetch();
              const editions = [];

              let textIsInEdition = false;
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
	            // console.log('lemmaText', lemmaText);

              if (this.state.selectedLemmaEdition.length) {
                  lemmaText.forEach(function(edition) {
                      if (edition.slug === self.state.selectedLemmaEdition) {
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
				style.backgroundColor = "#E0F7FA";
			};
		},

    handeLineMouseLeave(event) {
        if (!this.props.disableEdit) {
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
						this.props.updateSelectedLines(id, null);
				} else if (id === this.props.selectedLineFrom && this.props.selectedLineTo === 0) {
						this.props.updateSelectedLines(0, null);
				} else if (this.props.selectedLineTo === 0 && id > this.props.selectedLineFrom) {
						this.props.updateSelectedLines(null, id);
				} else if (this.props.selectedLineTo === 0 && id < this.props.selectedLineFrom) {
						this.props.updateSelectedLines(id, this.props.selectedLineFrom);
				} else {
						this.props.updateSelectedLines(id, 0);
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
		const self = this;
		let contextPanelStyles = "lemma-panel paper-shadow";
		contextPanelStyles += " extended";


		return (
				<div>
						{this.data.selectedLemmaEdition && 'lines' in this.data.selectedLemmaEdition ?

								<div className={contextPanelStyles}>

										{/* <IconButton
												className="close-lemma-panel"
												onClick={this.props.closeContextPanel}
												iconClassName="mdi mdi-close"
										/> */}

										<div className="lemma-text-wrap">

												<LinePagination
													linePagination={this.state.linePagination}
													linePaginationClicked={this.linePaginationClicked}
												/>

												{this.state.lineFrom > 1 ?
													<div className="before-link">
															<RaisedButton
																	className="light"
																	label="Previous"
																	onClick={this.onBeforeClicked}
																	icon={<i className="mdi mdi-chevron-up" />}
															/>
													</div>
												: '' }

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
																	id={line.n}
																	dangerouslySetInnerHTML={{__html: line.html}}
																	onMouseEnter={self.handeLineMouseEnter}
																	onMouseLeave={self.handeLineMouseLeave}
																	onClick={self.handleLineClick}
																	style={{cursor: "pointer"}}>
																</div>

														</div>

												})}

												{this.state.lineFrom < this.state.maxLine ?
													<div className="after-link">
														<RaisedButton
															className="light"
															label="Next"
															onClick={this.onAfterClicked}
															icon={<i className="mdi mdi-chevron-down" />}
														/>
													</div>
												: '' }

												{this.data.selectedLemmaEdition.lines.length === 0 ?
													<div className="no-results">
														<p>
															No source text found for your query.
														</p>
													</div>
												: '' }

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
										{/*<IconButton
												className="close-lemma-panel"
												onClick={this.props.closeContextPanel}
												iconClassName="mdi mdi-close"
										/>*/}
										<div className="lemma-text-wrap">
											<br />
											<br />
											<div className="well-spinner" />
										</div>
								</div>
						}

				</div>

				);
		}

});
