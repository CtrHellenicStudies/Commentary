import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextNodes from '/imports/collections/textNodes';

// components:
import ContextPanelText from '/imports/ui/components/commentary/contextPanel/ContextPanelText'; // eslint-disable-line import/no-absolute-path

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

	componentDidUpdate(prevProps, prevState) {
		const isLemmaEditionChange = prevState.selectedLemmaEdition !== this.state.selectedLemmaEdition;
		const isHighlightingChange = prevState.highlightingVisible !== this.state.highlightingVisible;
		if (!(isLemmaEditionChange || isHighlightingChange)) {
			this.scrollElement('open');
		}
		const commentGroup = this.props.commentGroup;
		if (commentGroup.ref !== prevProps.commentGroup.ref) {
			this.setState({
				lineFrom: commentGroup.lineFrom,
				lineTo: commentGroup.lineFrom + 49,
			});
		}
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

		if (lemmaQuery['work.slug'] === 'homeric-hymns') {
			lemmaQuery['work.slug'] = 'hymns';
		}

		Meteor.subscribe('textNodes', lemmaQuery);
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
		const self = this;
		switch (state) {
		case 'open':
			window.requestAnimationFrame(() => {
				setTimeout(() => {
					const scroll = $(`#comment-group-${self.props.commentLemmaIndex}`).offset().top;
					$(document).scrollTop(scroll);
				}, 300);
			});
			break;
		case 'close':
			window.requestAnimationFrame(() => {
				setTimeout(() => {
					$(document).scrollTop(self.props.scrollPosition);
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

				<ContextPanelText
					onBeforeClicked={this.onBeforeClicked}
					onAfterClicked={this.onAfterClicked}
					selectedLemmaEdition={this.data.selectedLemmaEdition}
					lineFrom={this.state.lineFrom}
					commentGroup={this.props.commentGroup}
					maxLine={this.state.maxLine}
				/>

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
