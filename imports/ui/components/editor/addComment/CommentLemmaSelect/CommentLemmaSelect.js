import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

// models
import TextNodes from '/imports/models/textNodes';
import Editions from '/imports/models/editions';

// lib:
import muiTheme from '/imports/lib/muiTheme';
import Utils from '/imports/lib/utils';


const CommentLemmaSelect = React.createClass({

	propTypes: {
		workSlug: PropTypes.string.isRequired,
		subworkN: PropTypes.number.isRequired,
		sectionN: PropTypes.number,
		selectedLineFrom: PropTypes.number.isRequired,
		selectedLineTo: PropTypes.number.isRequired,
		selectedLemmaEdition: PropTypes.object,
		lemmaText: PropTypes.array,
	},

	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			selectedLemmaEdition: '',
			lineLetterValue: '',
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	onLineLetterValueChange(event) {
		this.setState({
			lineLetterValue: event.target.value,
		});
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
						this.props.selectedLemmaEdition &&
						'lines' in this.props.selectedLemmaEdition ?
							<article className="comment lemma-comment paper-shadow">

								{this.props.selectedLemmaEdition.lines.map((line, i) => (
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
									{this.props.lemmaText.map((lemmaTextEdition, i) => {
										const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

										return (<RaisedButton
											key={i}
											label={lemmaEditionTitle}
											data-edition={lemmaTextEdition.title}
											className={self.props.selectedLemmaEdition.slug === lemmaTextEdition.slug ?
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

const CommentLemmaSelectContainer = createContainer(({ selectedLineFrom, selectedLineTo, workSlug, subworkN, sectionN }) => {
	const lemmaText = [];
	// var commentGroup = this.props.commentGroup;
	const selectedLemmaEdition = {
		lines: [],
		slug: '',
	};
	let lemmaQuery = {};
	if (selectedLineFrom <= selectedLineTo) {
		lemmaQuery = {
			'work.slug': workSlug,
			'subwork.n': subworkN,
			'text.n': {
				$gte: selectedLineFrom,
				$lte: selectedLineTo,
			},
		};
	} else {
		lemmaQuery = {
			'work.slug': workSlug,
			'subwork.n': subworkN,
			'text.n': {
				$gte: selectedLineFrom,
				$lte: selectedLineFrom,
			},
		};
	}

	if (sectionN) {
		lemmaQuery['section.n'] = sectionN;
	}

	console.log("##########")
	console.log("##########")
	console.log("##########")
	console.log("##########")
	console.log(sectionN)
	console.log(lemmaQuery);


	const textNodesSubscription = Meteor.subscribe('textNodes', lemmaQuery);
	const textNodesCursor = TextNodes.find(lemmaQuery);

	const editionsSubscription = Meteor.subscribe('editions');
	const editions = editionsSubscription.ready() ? Utils.textFromTextNodesGroupedByEdition(textNodesCursor, Editions) : [];

	return {
		lemmaText: editions,
		selectedLemmaEdition: editions[0],
		ready: textNodesSubscription.ready() && editionsSubscription.ready(),
	};
}, CommentLemmaSelect);

export default CommentLemmaSelectContainer;
