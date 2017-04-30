import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import TextNodes from '/imports/api/collections/textNodes';

LemmaReferenceModal = React.createClass({

	propTypes: {
		visible: React.PropTypes.bool,
		top: React.PropTypes.number.isRequired,
		left: React.PropTypes.number.isRequired,
		work: React.PropTypes.string.isRequired,
		subwork: React.PropTypes.number.isRequired,
		lineFrom: React.PropTypes.number.isRequired,
		lineTo: React.PropTypes.number,
		closeLemmaReference: React.PropTypes.func.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			selectedLemmaEditionIndex: 0,

		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		const lemmaQuery = {
			'work.slug': this.props.work,
			'subwork.n': this.props.subwork,
			'text.n': {
				$gte: this.props.lineFrom,
			},
		};
		let lemmaText = [];

		if (this.props.lineTo) {
			lemmaQuery['text.n'].$lte = this.props.lineTo;
		} else {
			lemmaQuery['text.n'].$lte = this.props.lineFrom;
		}

		const textHandle = Meteor.subscribe('textNodes', lemmaQuery);
		if (textHandle.ready()) {
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
		}

		return {
			lemmaText,
		};
	},

	toggleEdition(editionSlug) {
		if (this.data.lemmaText.length) {
			if (this.data.lemmaText[this.state.selectedLemmaEditionIndex].slug !== editionSlug) {
				let newSelectedEditionIndex = 0;
				this.data.lemmaText.forEach((edition, index) => {
					if (edition.slug === editionSlug) {
						newSelectedEditionIndex = index;
					}
				});

				this.setState({
					selectedLemmaEditionIndex: newSelectedEditionIndex,
				});
			}
		}
	},

	toggleHighlighting() {
		this.setState({
			highlightingVisible: !this.state.highlightingVisible,
		});
	},

	render() {
		const self = this;
		const lemmaText =
			this.data.lemmaText || [];
		const selectedLemmaEdition =
			this.data.lemmaText[this.state.selectedLemmaEditionIndex] || { lines: [] };
		const styles = {
			lemmaReferenceModal: {
				top: this.props.top,
				left: this.props.left,

			},

		};
		const hasLemma = ~selectedLemmaEdition.lines.length;

		return (
			<div
				className={`reference-modal${(this.props.visible && hasLemma) ?
					' reference-modal-visible' : ''}`}
				style={styles.lemmaReferenceModal}
			>
				<article className="comment	lemma-comment paper-shadow ">

					<div className="reference-text">
						{selectedLemmaEdition.lines.map((line, i) => (
							<p
								key={i}
								className="lemma-text"
								dangerouslySetInnerHTML={{ __html: line.html }}
							/>
						))}
					</div>

					<div className="edition-tabs tabs">
						{lemmaText.map((lemmaTextEdition, i) => {
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
					<div className="meta-tabs tabs">
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

					<i
						className="mdi mdi-close paper-shadow"
						onClick={this.props.closeLemmaReference}
					/>
				</article>

			</div>

		);
	},

});

export default LemmaReferenceModal;
