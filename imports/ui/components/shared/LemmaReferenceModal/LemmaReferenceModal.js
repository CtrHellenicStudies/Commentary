import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { compose } from 'react-apollo';
import { createContainer, ReactMeteorData } from 'meteor/react-meteor-data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Draggable from 'react-draggable';

// models
import TextNodes from '/imports/models/textNodes';

// graphql
import { editionsQuery } from '/imports/graphql/methods/editions';
import { textNodesQuery } from '/imports/graphql/methods/textNodes';

// lib:
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

const LemmaReferenceModal = React.createClass({

	propTypes: {
		visible: PropTypes.bool,
		top: PropTypes.number.isRequired,
		left: PropTypes.number.isRequired,
		work: PropTypes.string.isRequired,
		subwork: PropTypes.number.isRequired,
		lineFrom: PropTypes.number.isRequired,
		lineTo: PropTypes.number,
		closeLemmaReference: PropTypes.func.isRequired,
		lemmaText: PropTypes.array,
		ready: PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			selectedLemmaEditionIndex: 0,

		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},


	toggleEdition(editionSlug) {
		if (this.props.lemmaText.length) {
			if (this.props.lemmaText[this.state.selectedLemmaEditionIndex].slug !== editionSlug) {
				let newSelectedEditionIndex = 0;
				this.props.lemmaText.forEach((edition, index) => {
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
			this.props.lemmaText || [];
		const selectedLemmaEdition =
			this.props.lemmaText[this.state.selectedLemmaEditionIndex] || { lines: [] };
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

						{this.props.ready ?
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
			</Draggable>

		);
	},

});

const LemmaReferenceModalContainer = createContainer((props) => {

	const { work, subwork, lineFrom, lineTo } = props;
	const tenantId = sessionStorage.getItem('tenantId');

	if (tenantId) {
		props.textNodesQuery.refetch({
			tenantId: tenantId,
			workSlug: work,
			subworkN: subwork,
			lineFrom: lineFrom,
			lineTo: lineFrom <= lineTo ? lineTo : lineFrom
		});
	}

	const textNodesCursor = props.textNodesQuery.loading ? [] : props.textNodesQuery.textNodes;
	const editions = props.editionsQuery.loading ?
		Utils.textFromTextNodesGroupedByEdition(textNodesCursor, props.editionsQuery.editions) : [];

	return {
		lemmaText: editions,
		ready: !props.textNodesQuery.loading && !props.editionsQuery.editions,
	};
}, LemmaReferenceModal);

export default compose(editionsQuery, textNodesQuery)(LemmaReferenceModalContainer);
