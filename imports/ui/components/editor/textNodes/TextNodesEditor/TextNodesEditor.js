import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import { FormGroup } from 'react-bootstrap';

// actions
import * as textNodesActions from '/imports/actions/textNodes';

// api:
import TextNodes from '/imports/models/textNodes';
import Editions from '/imports/models/editions';
import Works from '/imports/models/works';

// lib:
import Utils from '/imports/lib/utils';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';
import TextNodeInput from '../TextNodeInput';


/*
	helpers
*/
const getContextPanelStyles = (open, highlightingVisible) => {
	let contextPanelStyles = 'lemma-panel paper-shadow';
	if (open) {
		contextPanelStyles += ' extended';
	}
	if (highlightingVisible) {
		contextPanelStyles += ' highlighting-visible';
	}
	return contextPanelStyles;
};

const getSortedEditions = (editions) => {
	const sortedEditions = [];
	editions.forEach((edition) => {
		const newEdition = {
			slug: edition.slug,
			title: edition.title,
			lines: _.sortBy(edition.lines, 'n')
		};
		sortedEditions.push(newEdition);
	});
	return sortedEditions;
};


class TextNodesEditor extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			textNodes: [],
		};
	}

	addTextNodeBlock() {
		this.state.textNodes.push({ textNodeId: Random.id() });
		this.setState({
			textNodes: this.state.textNodes,
		});
	}

	removeTextNodeBlock(i) {
		this.setState({
			textNodes: update(this.state.textNodes, { $splice: [[i, 1]] }),
		});
	}

	moveTextNodeBlock(dragIndex, hoverIndex) {
		const { textNodes } = this.state;
		const dragIntroBlock = textNodes[dragIndex];

		this.setState(update(this.state, {
			textNodes: {
				$splice: [
					[dragIndex, 1],
					[hoverIndex, 0, dragIntroBlock],
				],
			},
		}));
	}


	render() {
		const { textNodes } = this.state;

		return (
			<div>
				<FormGroup
					controlId="textNodes"
					className="form-group--textNodes"
				>
					<ListGroupDnD>
						{/*
							DnD: add the ListGroupItemDnD component
							IMPORTANT:
							"key" prop must not be taken from the map function - has to be unique like _id
							value passed to the "key" prop must not be then edited in a FormControl component
								- will cause errors
							"index" - pass the map functions index variable here
						*/}
						{textNodes.map((textNode, i) => {
							const _textNodeOptions = [];
							textNodeOptions.forEach((rW) => {
								_textNodeOptions.push({
									value: rW.value,
									label: rW.label,
									slug: rW.slug,
									i,
								});
							});

							return (
								<ListGroupItemDnD
									key={textNode.textNodeId}
									index={i}
									className="form-subitem form-subitem--textNode"
									moveListGroupItem={this.moveTextNodeBlock}
								>
									<div
										className="reference-work-item"
									>
										<div
											className="remove-reference-work-item"
											onClick={this.removeTextNodeBlock.bind(this, i)}
										>
											<IconButton
												iconClassName="mdi mdi-close"
												style={{
													padding: '0',
													width: '32px',
													height: '32px',
													borderRadius: '100%',
													border: '1px solid #eee',
													color: '#666',
													margin: '0 auto',
													background: '#f6f6f6',
												}}
											/>
										</div>
										<FormGroup>
											<ControlLabel>Number: </ControlLabel>
											<FormsyText
												name={`${i}_number`}
												defaultValue={textNode.n}
											/>
										</FormGroup>
										<FormGroup>
											<ControlLabel>Letter: </ControlLabel>
											<FormsyText
												name={`${i}_letter`}
												defaultValue={textNode.letter}
											/>
										</FormGroup>
										<FormGroup>
											<FormsyText
												name={`${i}_text`}
												defaultValue={textNode.text}
											/>
										</FormGroup>
									</div>
								</ListGroupItemDnD>
							);
						})}
					</ListGroupDnD>
					<RaisedButton
						label="Add line of text"
						onClick={this.addTextNodeBlock}
					/>
				</FormGroup>

			</div>
		);
	}
}

const TextNodesEditorContainer = createContainer(({ lineFrom, workSlug, subworkN }) => {

	const lemmaQuery = {
		'work.slug': workSlug,
		'subwork.n': subworkN,
		'text.n': {
			$gte: lineFrom,
			$lte: lineFrom + 49,
		},
	};

	if (lemmaQuery['work.slug'] === 'homeric-hymns') {
		lemmaQuery['work.slug'] = 'hymns';
	}

	Meteor.subscribe('textNodes', lemmaQuery);
	const editionsSubscription = Meteor.subscribe('editions');
	const editions = Editions.find().fetch();
	const textNodesCursor = TextNodes.find(lemmaQuery);
	const editionsRaw = editionsSubscription.ready() ? Utils.textFromTextNodesGroupedByEdition(textNodesCursor, Editions) : [];
	const editionsSorted = getSortedEditions(editionsRaw);

	return {
		lemmaText: editionsSorted,
		editions,
	};

}, TextNodesEditor);

const mapStateToProps = (state, props) => ({
	textNodes: state.textNodes.textNodes,
	work: state.textNodes.work,
	subwork: state.textNodes.subwork,
	edition: state.textNodes.edition,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(textNodesActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextNodesEditorContainer);
