import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer, ReactMeteorData } from 'meteor/react-meteor-data';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import Draggable from 'react-draggable';

// api
import TextNodes from '/imports/models/textNodes';
import Editions from '/imports/models/editions';

// lib:
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';

const LemmaReferenceModal = React.createClass({

	propTypes: {
		visible: React.PropTypes.bool,
		top: React.PropTypes.number.isRequired,
		left: React.PropTypes.number.isRequired,
		work: React.PropTypes.string.isRequired,
		subwork: React.PropTypes.number.isRequired,
		lineFrom: React.PropTypes.number.isRequired,
		lineTo: React.PropTypes.number,
		closeLemmaReference: React.PropTypes.func.isRequired,
		lemmaText: React.PropTypes.array,
		ready: React.PropTypes.bool,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
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

const LemmaReferenceModalContainer = createContainer(({work, subwork, lineFrom, lineTo}) => {
	const lemmaQuery = {
		'work.slug': work,
		'subwork.n': subwork,
		'text.n': {
			$gte: lineFrom,
		},
	};
	let lemmaText = [];

	if (lineTo) {
		lemmaQuery['text.n'].$lte = lineTo;
	} else {
		lemmaQuery['text.n'].$lte = lineFrom;
	}

	const textHandle = Meteor.subscribe('textNodes', lemmaQuery);
	const handle = Meteor.subscribe('textNodes', lemmaQuery);
	const editionsSubscription = Meteor.subscribe('editions');
	const textNodesCursor = TextNodes.find(lemmaQuery);
	const editions = editionsSubscription.ready() ? Utils.textFromTextNodesGroupedByEdition(textNodesCursor, Editions) : [];

	return {
		lemmaText: editions,
		ready: textHandle.ready(),
	};
}, LemmaReferenceModal);

export default LemmaReferenceModalContainer;
