import RaisedButton from 'material-ui/RaisedButton';
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

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			selectedLemmaEdition: '',
			lineLetterValue: '',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	onLineLetterValueChange(event) {
		this.setState({
			lineLetterValue: event.target.value,
		});
	},

	getMeteorData() {
		const that = this;

		let lemmaText = [];
		// var commentGroup = this.props.commentGroup;
		let selectedLemmaEdition = {
			lines: [],
			slug: '',
		};
		let lemmaQuery = {};
		if (this.props.selectedLineFrom <= this.props.selectedLineTo) {
			lemmaQuery = {
				'work.slug': this.props.workSlug,
				'subwork.n': this.props.subworkN,
				'text.n': {
					$gte: this.props.selectedLineFrom,
					$lte: this.props.selectedLineTo,
				},
			};
		} else {
			lemmaQuery = {
				'work.slug': this.props.workSlug,
				'subwork.n': this.props.subworkN,
				'text.n': {
					$gte: this.props.selectedLineFrom,
					$lte: this.props.selectedLineFrom,
				},
			};
		}

		const textNodesSubscription = Meteor.subscribe('textNodes', lemmaQuery);
		if (textNodesSubscription.ready()) {
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
							lines: [{
								html: text.html,
								n: text.n,
							}],
						});
					}
				});
			});

			lemmaText = editions;

			if (this.state.selectedLemmaEdition.length) {
				lemmaText.forEach((edition) => {
					if (edition.slug === that.state.selectedLemmaEdition) {
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

	render() {
		const self = this;

		return (
			<div className="comments lemma-panel-visible">
				<div className="comment-outer comment-lemma-comment-outer">

					{this.props.selectedLineFrom > 0 &&
						this.data.selectedLemmaEdition &&
						'lines' in this.data.selectedLemmaEdition ?
						<article className="comment lemma-comment paper-shadow">

							{this.data.selectedLemmaEdition.lines.map((line, i) => (
								<p
									key={i}
									className="lemma-text"
									dangerouslySetInnerHTML={{ __html: line.html }}
								/>
							))}

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
								''
							}

							<div className="edition-tabs tabs">
								{this.data.lemmaText.map((lemmaTextEdition, i) => {
									const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

									return (<RaisedButton
										key={i}
										label={lemmaEditionTitle}
										data-edition={lemmaTextEdition.title}
										className={self.data.selectedLemmaEdition.slug === lemmaTextEdition.slug ?
											'edition-tab tab selected-edition-tab' : 'edition-tab tab'}
										onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
									/>);
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
							{/* <div className="context-tabs tabs">
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
	},
});
