import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Draggable from 'react-draggable';


// graphql
import { editionsQuery } from '/imports/graphql/methods/editions';
import { textNodesQuery } from '/imports/graphql/methods/textNodes';

// lib:
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

class LemmaReferenceModal extends Component {

	constructor(props) {
		super(props);
		this.setState({
			selectedLemmaEditionIndex: 0,
		});
		this.toggleEdition = this.toggleEdition.bind(this);
		this.toggleHighlighting = this.toggleHighlighting.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.textNodesQuery.loading || nextProps.editionsQuery.loading) {
			return;
		}
		console.log(nextProps.textNodesQuery.variables);
		if (nextProps.textNodesQuery.variables.workSlug === undefined) {
			const { lineFrom, work, subwork } = this.props;
			const lineTo = !this.props.lineTo || lineFrom > this.props.lineTo ? lineFrom : this.props.lineTo;
			const properties = {
				workSlug: worker.slug,
				subworkN: subwork.n,
				lineFrom: lineFrom,
				lineTo: lineTo
			};
			nextProps.textNodesQuery.refetch(properties);
		}
		const textNodesCursor = nextProps.textNodesQuery.textNodes;
		const editions = Utils.textFromTextNodesGroupedByEdition(textNodesCursor, nextProps.editionsQuery.editions);
		this.setState({
			lemmaText: editions,
			ready: !nextProps.textNodesQuery.loading && !nextProps.editionsQuery.editions,
		});
	}
	toggleEdition(editionSlug) {
		if (this.state.lemmaText.length) {
			if (this.state.lemmaText[this.state.selectedLemmaEditionIndex].slug !== editionSlug) {
				let newSelectedEditionIndex = 0;
				this.state.lemmaText.forEach((edition, index) => {
					if (edition.slug === editionSlug) {
						newSelectedEditionIndex = index;
					}
				});

				this.setState({
					selectedLemmaEditionIndex: newSelectedEditionIndex,
				});
			}
		}
	}
	toggleHighlighting() {
		this.setState({
			highlightingVisible: !this.state.highlightingVisible,
		});
	}
	render() {
		const self = this;
		const lemmaText =
			this.state.lemmaText || [];
		const selectedLemmaEdition =
			this.state.lemmaText[this.state.selectedLemmaEditionIndex] || { lines: [] };
		const styles = {
			lemmaReferenceModal: {
				top: this.props.top,
				left: this.props.left,

			},
		};
		const hasLemma = ~selectedLemmaEdition.lines.length;

		return (
			<Draggable>
				<div
					className={`reference-modal${(this.props.visible && hasLemma) ?
						' reference-modal-visible' : ''}`}
					style={styles.lemmaReferenceModal}
				>
					<article className="comment	lemma-comment paper-shadow ">

						{this.state.ready ?
							<div className="reference-text">
								{selectedLemmaEdition.lines.map((line, i) => (
									<p
										key={i}
										className="lemma-text"
										dangerouslySetInnerHTML={{ __html: line.html }}
									/>
								))}
							</div>
							:
							<div className="reference-text">
								<div className="loading-mock lemma-filler lemma-filler-1" />
								<div className="loading-mock lemma-filler lemma-filler-2" />
							</div>
						}

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
						<div className="meta-tabs tabs" />

						<i
							className="mdi mdi-close paper-shadow"
							onClick={this.props.closeLemmaReference}
						/>
					</article>

				</div>
			</Draggable>

		);
	}

}

LemmaReferenceModal.propTypes = {
	visible: PropTypes.bool,
	top: PropTypes.number.isRequired,
	left: PropTypes.number.isRequired,
	work: PropTypes.string.isRequired,
	subwork: PropTypes.number.isRequired,
	lineFrom: PropTypes.number.isRequired,
	lineTo: PropTypes.number,
	closeLemmaReference: PropTypes.func.isRequired,
	editionsQuery: PropTypes.object,
	textNodesQuery: PropTypes.object
};

export default compose(
	editionsQuery,
	textNodesQuery
)(LemmaReferenceModal);
