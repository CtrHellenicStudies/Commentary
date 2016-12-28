import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

ContextPanel = React.createClass({

	propTypes: {
		open: React.PropTypes.bool.isRequired,
		commentGroup: React.PropTypes.object.isRequired,
		closeContextPanel: React.PropTypes.func.isRequired,
		scrollPosition: React.PropTypes.number.isRequired,
		commentLemmaIndex: React.PropTypes.number.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		const commentGroup = this.props.commentGroup;
		const lineFrom = commentGroup.lineFrom;
		const lineTo = lineFrom + 49;
		return {
			selectedLemmaEdition: '',
			lineFrom,
			lineTo,
			maxLine: 0,
			highlightingVisible: true,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	componentDidMount() {
		this.scrollElement('open');
		Meteor.call('getMaxLine', this.props.commentGroup.work.slug,
			this.props.commentGroup.subwork.n, (err, res) => {
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
			}
		);
	},

	componentDidUpdate(prevProps) {
		this.scrollElement('open');
		const commentGroup = this.props.commentGroup;
		if (commentGroup.ref !== prevProps.commentGroup.ref) {
			this.setState({
				lineFrom: commentGroup.lineFrom,
				lineTo: commentGroup.lineFrom + 49,
			});
		}
	},

	componentWillUnmount() {
		this.scrollElement('close');
	},

	onAfterClicked() {
		if (this.state.lineTo <= this.state.maxLine) {
			this.setState({
				lineFrom: this.state.lineFrom + 25,
				lineTo: this.state.lineTo + 25,
			});
		}
	},

	onBeforeClicked() {
		if (this.state.lineFrom !== 1) {
			this.setState({
				lineFrom: this.state.lineFrom - 25,
				lineTo: this.state.lineTo - 25,
			});
		}
	},

	getMeteorData() {
		let lemmaText = [];
		const commentGroup = this.props.commentGroup;
		let selectedLemmaEdition = { lines: [], slug: '' };

		const lemmaQuery = {
			'work.slug': commentGroup.work.slug,
			'subwork.n': commentGroup.subwork.n,
			'text.n': {
				$gte: this.state.lineFrom,
				$lte: this.state.lineTo,
			},
		};

		const handle2 = Meteor.subscribe('textNodes', lemmaQuery);
		if (handle2.ready()) {
			const textNodes = TextNodes.find(lemmaQuery).fetch();
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
							lines: [
								{
									html: text.html,
									n: text.n,
								},
							],
						});
					}
				});
			});

			lemmaText = editions;

			if (this.state.selectedLemmaEdition.length) {
				lemmaText.forEach((edition) => {
					if (edition.slug === this.state.selectedLemmaEdition) {
						selectedLemmaEdition = edition;
					}
				});
			} else {
				selectedLemmaEdition = lemmaText[0];
			}
		}
		return {
			lemmaText,
			selectedLemmaEdition,
		};
	},

	toggleEdition(editionSlug) {
		if (this.state.selectedLemmaEdition !== editionSlug) {
			this.setState({
				selectedLemmaEdition: editionSlug,
			});
		}
	},

	toggleHighlighting() {
		this.setState({
			highlightingVisible: !this.state.highlightingVisible,
		});
	},

	scrollElement(state) {
		const that = this;
		switch (state) {
		case 'open':
			window.requestAnimationFrame(() => {
				const scroll = $(`#comment-group-${that.props.commentLemmaIndex}`).offset().top;
				$(document).scrollTop(scroll);
			});
			break;
		case 'close':
			window.requestAnimationFrame(() => {
				setTimeout(() => {
					$(document).scrollTop(that.props.scrollPosition);
				}, 1000);
			});
			break;
		default:
			break;
		}
	},

	render() {
		const self = this;
		let contextPanelStyles = 'lemma-panel paper-shadow';

		if (this.props.open) {
			contextPanelStyles += ' extended';
		}

		if (this.state.highlightingVisible) {
			contextPanelStyles += ' highlighting-visible';
		}

		return (
			<div className={contextPanelStyles}>

				<IconButton
					className="close-lemma-panel"
					onClick={this.props.closeContextPanel}
					iconClassName="mdi mdi-close"
				/>

				<div className="lemma-text-wrap">

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

					{this.data.selectedLemmaEdition.lines.map((line, i) => {
						let lineClass = 'lemma-line';
						const lineFrom = self.props.commentGroup.lineFrom;
						let lineTo;

						if (typeof self.props.commentGroup.lineTo !== 'undefined') {
							lineTo = self.props.commentGroup.lineTo;
						} else {
							lineTo = self.props.commentGroup.lineFrom;
						}

						if (lineFrom <= line.n && line.n <= lineTo) {
							lineClass += ' highlighted';
						}

						return (
							<div
								className={lineClass}
								key={i}
							>

								<div className="lemma-meta">
									{(line.n % 5 === 0 || line.n === 1) ?
										<span className="lemma-line-n">
											{line.n}
										</span>
										:
										''
									}
								</div>

								<div className="lemma-text" dangerouslySetInnerHTML={{ __html: line.html }} />


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

				</div>

				<div className="lemma-panel-tabs">
					<div className="edition-tabs tabs">
						{this.data.lemmaText.map((lemmaTextEdition, i) => {
							const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

							return (
								<RaisedButton
									key={i}
									label={lemmaEditionTitle}
									data-edition={lemmaTextEdition.title}
									className={self.data.selectedLemmaEdition.slug === lemmaTextEdition.slug ?
										'edition-tab tab selected-edition-tab' : 'edition-tab tab'}
									onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
								/>
							);
						})}

					</div>

					<div className="meta-tabs tabs">
						<FlatButton
							label="Highlighting"
							className="edition-tab tab"
							onClick={this.toggleHighlighting}
						/>
						{/*
						<FlatButton
							label="Entities"
							className="edition-tab tab"
							onClick={this.toggleEntities}
						/>
						<FlatButton
							label="Scansion"
							className="edition-tab tab"
							onClick={this.toggleScansion}
						/>
						*/}
					</div>
				</div>
			</div>
		);
	},
});
