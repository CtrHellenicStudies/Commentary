import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import autoBind from 'react-autobind';
import { createContainer } from 'meteor/react-meteor-data';
import {
	FormGroup,
	ControlLabel,
} from 'react-bootstrap';
import update from 'immutability-helper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

// api:
import Editions from '/imports/models/editions';
import TextNodes from '/imports/models/textNodes';
import Works from '/imports/models/works';

// lib:
import Utils from '/imports/lib/utils';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';

// helpers
import { getSortedEditions } from '../helpers';


const ListGroupItemDnD = createListGroupItemDnD('textNodeBlocks');


class TextNodesInput extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			textNodes: [],
		};
		autoBind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.textNodes.length !== this.props.textNodes.length) {
			this.setState({
				textNodes: nextProps.textNodes,
			});
		}
	}

	addTextNodeBlock() {
		const { workId, workSlug, editionId, subworkN, subworkTitle, lineFrom, defaultTextNodes } = this.props;
		const { textNodes } = this.state;
		let defaultN = 1;

		this.state.textNodes.push({
			_id: Random.id(),
			text: {
				edition: editionId,
				n: defaultN,
				text: '',
			},
			subwork: {
				title: subworkTitle,
				n: subworkN,
			},
			work: {
				_id: workId,
				slug: workSlug,
			},
			tenantId: Session.get('tenantId'),
		});
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
		const { editionId } = this.props;

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
			<FormGroup
				controlId="textNodes"
				className="text-nodes-editor-text-input"
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
						return (
							<ListGroupItemDnD
								key={textNode.n}
								index={i}
								className="form-subitem form-subitem--textNode text-node-input"
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
									<FormGroup className="text-node-number-input">
										<TextField
											name={`${i}_number`}
											hintText="0"
											defaultValue={textNode.n}
											style={{
												width: '40px',
												margin: '0 10px',
											}}
										/>
									</FormGroup>
									<FormGroup className="text-node-text-input">
										<TextField
											name={`${i}_text`}
											defaultValue={textNode.html}
											style={{
												width: '700px',
												margin: '0 10px',
											}}
										/>
									</FormGroup>
								</div>
							</ListGroupItemDnD>
						);
					})}
				</ListGroupDnD>
				<RaisedButton
					label="Show more"
					className="text-nodes-input-action-button"
					onClick={this.props.loadMore}
				/>
				<RaisedButton
					label="Add line of text"
					className="text-nodes-input-action-button"
					onClick={this.addTextNodeBlock}
				/>
			</FormGroup>
		);
	}
}

/*
const mapStateToProps = (state, props) => ({
	textNodes: state.textNodes.textNodes,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(textNodesActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextNodesInput);
*/

const TextNodesInputContainer = createContainer(({ workId, workSlug, editionId, subworkN, lineFrom, limit }) => {
	let textNodes;
	let textNodesByEditions = [];
	let textNodesByEditionsSorted = [];
	let selectedEdition = { lines: [] };

	const lemmaQuery = {
		'work.slug': workSlug,
		'subwork.n': subworkN,
		'text.n': {
			$gte: parseInt(lineFrom, 10),
			$lte: parseInt(lineFrom, 10) + limit,
		},
		'text.edition': editionId,
	};

	if (lemmaQuery['work.slug'] === 'homeric-hymns') {
		lemmaQuery['work.slug'] = 'hymns';
	}

	const textNodeSubscription = Meteor.subscribe('textNodes', lemmaQuery, 0, limit);
	const editionsSubscription = Meteor.subscribe('editions');
	const ready = textNodeSubscription.ready() && editionsSubscription.ready();

	if (ready) {
		textNodes = TextNodes.find(lemmaQuery).fetch();
		textNodesByEditions = Utils.textFromTextNodesGroupedByEdition(textNodes, Editions);
		textNodesByEditionsSorted = getSortedEditions(textNodesByEditions);

		textNodesByEditionsSorted.forEach(edition => {
			if (edition._id === editionId) {
				selectedEdition = edition;
			}
		});

		if (!selectedEdition) {
			// TODO: handle errors related to incorrectly selected edition
			return null;
		}
	}


	return {
		textNodes: selectedEdition.lines,
		ready,
	};

}, TextNodesInput);

export default TextNodesInputContainer;
