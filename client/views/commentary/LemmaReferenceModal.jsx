import RaisedButton from "material-ui/RaisedButton";

LemmaReferenceModal = React.createClass({

	propTypes: {
		visible: React.PropTypes.bool,
		top: React.PropTypes.number,
		left: React.PropTypes.number,
		work: React.PropTypes.string,
		subwork: React.PropTypes.number,
		lineFrom: React.PropTypes.number,
		lineTo: React.PropTypes.number,
		closeLemmaReference: React.PropTypes.func,
	},

	getInitialState() {
		return {
			selectedLemmaEdition: {lines: []},

		};
	},

	mixins: [ReactMeteorData],

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
			// console.log('lemmaQuery', lemmaQuery);
			const textNodes = TextNodes.find(lemmaQuery).fetch();
			const editions = [];

			let textIsInEdition = false;
			textNodes.forEach(function (textNode) {
				textNode.text.forEach(function (text) {
					textIsInEdition = false;

					editions.forEach(function (edition) {
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

	componentDidUpdate() {
		// console.log('lemmaReferenceModal', this.props);
		if (this.data.lemmaText.length && this.state.selectedLemmaEdition.lines.length === 0) {
			this.setState({
				selectedLemmaEdition: this.data.lemmaText[0],
			});
		} else if (!this.props.visible && this.state.selectedLemmaEdition.lines.length) {
			this.setState({
				selectedLemmaEdition: {lines: []},
			});
		}
	},

	toggleEdition(editionSlug) {
		if (this.state.selectedLemmaEdition.slug !== editionSlug) {
			let newSelectedEdition = {};
			this.data.lemmaText.forEach(function (edition) {
				if (edition.slug === editionSlug) {
					newSelectedEdition = edition;
				}
			});

			this.setState({
				selectedLemmaEdition: newSelectedEdition,
			});
		}
	},

	render() {
		const self = this;
		const lemmaText = this.data.lemmaText;
		const styles = {
			lemmaReferenceModal: {
				top: this.props.top,
				left: this.props.left,

			},

		};
		const hasLemma = ~this.state.selectedLemmaEdition.lines.length;

		return (
			<div
				className={'lemma-reference-modal' + ((this.props.visible && hasLemma) ? ' lemma-reference-modal-visible' : '')}
				style={styles.lemmaReferenceModal}
			>
				<article className="comment	lemma-comment paper-shadow ">

					<div className="lemma-reference-text">
						{this.state.selectedLemmaEdition.lines.map(function (line, i) {
							return (<p
								key={i}
								className="lemma-text"
								dangerouslySetInnerHTML={{__html: line.html}}
							/>);
						})}
					</div>

					<div className="edition-tabs tabs">
						{lemmaText.map(function (lemmaTextEdition, i) {
							const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

							return (<RaisedButton
								key={i}
								label={lemmaEditionTitle}
								data-edition={lemmaTextEdition.title}
								className={self.state.selectedLemmaEdition.slug === lemmaTextEdition.slug ? 'edition-tab tab selected-edition-tab' : 'edition-tab tab'}
								onClick={self.toggleEdition.bind(null, lemmaTextEdition.slug)}
							/>);
						})}
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
