import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';

// components
import LinePagination from '/imports/ui/components/commentary/LinePagination';

// api
import TextNodes from '/imports/api/collections/textNodes';

// lib:
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

const ContextReader = React.createClass({

	propTypes: {
		workSlug: React.PropTypes.string.isRequired,
		subworkN: React.PropTypes.number.isRequired,
		selectedLineFrom: React.PropTypes.number.isRequired,
		selectedLineTo: React.PropTypes.number.isRequired,
		updateSelectedLines: React.PropTypes.func,
		initialLineFrom: React.PropTypes.number,
		initialLineTo: React.PropTypes.number,
		disableEdit: React.PropTypes.bool,
		ready: React.PropTypes.bool,
		lemmaText: React.PropTypes.array,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	getDefaultProps() {
		return {
			workSlug: 'iliad',
			subworkN: 1,
		};
	},

	getInitialState() {
		let lineFrom = 1;
		let lineTo = 50;

		if (this.props.initialLineFrom) {
			lineFrom = this.props.initialLineFrom;
		}
		if (this.props.initialLineTo) {
			lineTo = this.props.initialLineTo;
		}

		return {
			lineFrom,
			lineTo,
			selectedLemmaEditionSlug: '',
			maxLine: 0,
			linePagination: [],
		};
	},

	getChildContext() {
		return {
			muiTheme: getMuiTheme(muiTheme),
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
					}

					this.setState({
						linePagination,
						maxLine: res,
					});
				}
			});
		}
	},

	componentDidUpdate(prevProps) {
		let lineFrom = this.state.lineFrom;
		let lineTo = this.state.lineTo;

		if (prevProps.initialLineFrom && (prevProps.initialLineFrom !== this.props.initialLineFrom)) {
			lineFrom = this.props.initialLineFrom;
		}

		if (prevProps.initialLineTo && (prevProps.initialLineTo !== this.props.initialLineTo)) {
			lineTo = this.props.initialLineTo;
		}

		if (this.props.workSlug !== '' && this.props.subworkN !== 0 &&
			(prevProps.workSlug !== this.props.workSlug ||
			prevProps.subworkN !== this.props.subworkN)) {
			Meteor.call('getMaxLine', this.props.workSlug, this.props.subworkN, (err, res) => {
				if (err) {
					console.log(err);
				} else if (res) {
					const linePagination = [];
					for (let i = 1; i <= res; i += 100) {
						linePagination.push(i);
					}
					this.setState({
						linePagination,
						maxLine: res,
					});
				}
			});
		}

		// incase a subwork has less lines then initial this.state.lineTo
		if (this.state.maxLine !== 0 && this.state.maxLine < this.state.lineTo) {
			this.setState({ // eslint-disable-line
				lineTo: this.state.maxLine,
			});
		}

		if (Object.keys(this.lines).length) {
			if (this.props.selectedLineFrom === 0) {
				for (let i = lineFrom; i <= lineTo; i++) {
					if (i.toString() in this.lines && this.lines[i.toString()] && this.lines[i.toString()].style) {
						this.lines[i.toString()].style.borderBottom = '2px solid #ffffff';
					}
				}
			} else if (this.props.selectedLineTo === 0) {
				for (let i = lineFrom; i <= lineTo; i++) {
					if (i.toString() in this.lines && this.lines[i.toString()] && this.lines[i.toString()].style) {
						if (i === this.props.selectedLineFrom) {
							this.lines[i.toString()].style.borderBottom = '2px solid #B2EBF2';
						} else if (i.toString() in this.lines) {
							this.lines[i.toString()].style.borderBottom = '2px solid #ffffff';
						}
					}
				}
			} else {
				for (let i = lineFrom; i <= lineTo; i++) {
					if (i.toString() in this.lines && this.lines[i.toString()] && this.lines[i.toString()].style) {
						if (i >= this.props.selectedLineFrom && i <= this.props.selectedLineTo) {
							this.lines[i.toString()].style.borderBottom = '2px solid #B2EBF2';
						} else if (i.toString() in this.lines) {
							this.lines[i.toString()].style.borderBottom = '2px solid #ffffff';
						}
					}
				}
			}
		}

		if (this.props.workSlug !== '' && this.props.subworkN !== 0 &&
			(prevProps.workSlug !== this.props.workSlug || prevProps.subworkN !== this.props.subworkN
			|| prevProps.initialLineTo !== this.props.initialLineTo ||
			prevProps.initialLineFrom !== this.props.initialLineFrom)) {
			Meteor.call('getMaxLine', this.props.workSlug, this.props.subworkN, (err, res) => {
				if (err) {
					console.log(err);
					return;
				}

				const linePagination = [];
				for (let i = 1; i <= res; i += 100) {
					linePagination.push(i);
				}
				this.setState({
					linePagination,
					maxLine: res,
					lineFrom: this.props.initialLineFrom,
					lineTo: this.props.initialLineTo,
				});
			});
		}
	},

	onAfterClicked() {
		if (this.state.lineTo <= this.state.maxLine) {
			this.setState({
				lineFrom: this.state.lineFrom + 100,
				lineTo: this.state.lineTo + 100,
			});
		}
	},

	onBeforeClicked() {
		if (this.state.lineFrom !== 1) {
			this.setState({
				lineFrom: this.state.lineFrom - 100,
				lineTo: this.state.lineTo - 100,
			});
		}
	},

	lines: [],

	linePaginationClicked(line) {
		this.setState({
			lineFrom: line,
			lineTo: line + 50,
		});
	},

	toggleEdition(editionSlug) {
		if (this.state.selectedLemmaEdition !== editionSlug) {
			this.setState({
				selectedLemmaEdition: editionSlug,
			});
		}
	},

	handeLineMouseEnter(event) {
		if (!this.props.disableEdit) {
			const style = event.target.style;
			style.backgroundColor = '#E0F7FA';
		}
	},

	handeLineMouseLeave(event) {
		if (!this.props.disableEdit) {
			const style = event.target.style;
			style.backgroundColor = '#ffffff';
		}
	},

	handleLineClick(event) {
		if (!this.props.disableEdit) {
			const target = event.target;
			const id = parseInt(target.id, 10);
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
			}
		}
	},

	render() {
		const self = this;
		const { lemmaText } = this.props;
		const { selectedLemmaEditionSlug } = this.state;
		let contextPanelStyles = 'lemma-panel paper-shadow';
		contextPanelStyles += ' extended';

		let selectedLemmaEdition = {
			lines: [],
		};

		if (selectedLemmaEditionSlug.length) {
			lemmaText.forEach((edition) => {
				if (edition.slug === selectedLemmaEditionSlug) {
					selectedLemmaEdition = edition;
				}
			});
		} else if (lemmaText && lemmaText.length) {
			selectedLemmaEdition = lemmaText[0];
		}


		return (
			<div>
				{selectedLemmaEdition.lines.length ?
					<div className={contextPanelStyles}>
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
								:
								''
							}

							{selectedLemmaEdition.lines.map((line, i) => {
								const lineClass = 'lemma-line';
								return (
									<div className={lineClass} key={i}>
										<div
											className="lemma-text"
											id={line.n}
											ref={(component) => { this.lines[(line.n).toString()] = component; }}
											dangerouslySetInnerHTML={{ __html: line.html }}
											onMouseEnter={self.handeLineMouseEnter}
											onMouseLeave={self.handeLineMouseLeave}
											onClick={self.handleLineClick}
											style={{ cursor: 'pointer' }}
										/>
										<div className="lemma-meta">
											{(line.n % 5 === 0 || line.n === 1) ?
												<span className="lemma-line-n">
													{line.n}
												</span>
											: '' }
										</div>
									</div>
								);
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
								:
								''
							}

							{selectedLemmaEdition.lines.length === 0 ?
								<div className="no-results">
									<p>
										No source text found for your query.
									</p>
								</div>
							: ''}
						</div>

						<div className="edition-tabs tabs">
							{this.props.lemmaText.map((lemmaTextEdition, i) => {
								const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

								return (
									<RaisedButton
										key={i}
										label={lemmaEditionTitle}
										data-edition={lemmaTextEdition.title}
										className={selectedLemmaEdition.slug === lemmaTextEdition.slug ?
											'edition-tab tab selected-edition-tab' : 'edition-tab tab'}
										onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
									/>
								);
							})}
						</div>
					</div>
					:
					<div className={contextPanelStyles}>
						<div className="lemma-text-wrap">
							<br />
							<br />
							<div className="well-spinner" />
						</div>
					</div>
				}
			</div>
		);
	},

});

const ContextReaderContainer = createContainer(({workSlug, subworkN, initialLineFrom, initialLineTo}) => {

	if (!workSlug || !subworkN) {
		return {
			lemmaText: '',
			selectedLemmaEdition: '',
		};
	}

	const lemmaQuery = {
		'work.slug': workSlug,
		'subwork.n': subworkN,
		'text.n': {
			$gte: initialLineFrom,
			$lte: initialLineTo,
		},
	};

	if (lemmaQuery['work.slug'] === 'homeric-hymns') {
		lemmaQuery['work.slug'] = 'hymns';
	}

	const textNodesSubscription = Meteor.subscribe('textNodes', lemmaQuery);
	const textNodes = TextNodes.find(lemmaQuery, { sort: { 'text.n': 1 } }).fetch();
	const editions = [];

	let textIsInEdition = false;
	textNodes.forEach((textNode) => {
		textNode.text.forEach((text) => {
			textIsInEdition = false;

			editions.forEach((edition) => {
				if (text.edition.slug === edition.slug) {
					edition.lines.push({
						html: text.html,
						n: text.n,
					});
					textIsInEdition = true;
				}
			});

			if (!textIsInEdition) {
				editions.push({
					title: text.edition.title,
					slug: text.edition.slug,
					lines: [{
						html: text.html,
						n: text.n,
					}],
				});
			}
		});
	});

	return {
		lemmaText: editions,
		ready: textNodesSubscription.ready(),
	};
}, ContextReader);

export default ContextReaderContainer;
