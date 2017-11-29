import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'react-apollo';
import autoBind from 'react-autobind';
import { Meteor } from 'meteor/meteor';
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
import Cookies from 'js-cookie';
import { debounce } from 'throttle-debounce';

// models:
import Works from '/imports/models/works';

// lib:
import Utils from '/imports/lib/utils';
import _ from 'lodash';

// graphql
import { editionsQuery } from '/imports/graphql/methods/editions';
import { textNodesQuery, textNodeUpdateMutation } from '/imports/graphql/methods/textNodes';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';

// helpers
import { getSortedEditions } from '../helpers';


const ListGroupItemDnD = createListGroupItemDnD('textNodeBlocks');


class TextNodesInput extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			textNodes: this.props.textNodes,
			snackbarOpen: false,
			snackbarMessage: '',
		};

		this.onChangeN = this.onChangeN.bind(this);
		this.onChangeText = this.onChangeText.bind(this);
		this.addTextNodeBlock = this.addTextNodeBlock.bind(this);
		this.removeTextNodeBlock = this.removeTextNodeBlock.bind(this);
		this.moveTextNodeBlock = this.moveTextNodeBlock.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			textNodes: nextProps.textNodes,
		});

	}

	addTextNodeBlock() {
		const { workId, workSlug, editionId, subworkN, subworkTitle, lineFrom, defaultTextNodes } = this.props;
		const { textNodes } = this.state;
		const defaultN = 1;

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

	onChangeN(e, newValue) {
		const { editionId } = this.props;
		const { textNodes } = this.state;

		// persist event for debounced function
		e.persist();

		// get index of text node that is being edited
		const textElemIndex = parseInt(e.target.name.replace('_number', ''), 10);
		const editedTextNode = textNodes[textElemIndex];

		// regularize type of text node id
		let editedTextNodeId = editedTextNode._id;
		if (typeof editedTextNodeId === 'object') {
			editedTextNodeId = editedTextNodeId.valueOf();
		}
		this.props.textNodeUpdate(editedTextNodeId, editionId, editedTextNode.text, newValue).then((err, res) => {
			if (err) {
				console.error('Error editing text', err);
				this.showSnackBar(err.message);
			} else {
				this.showSnackBar('Updated');
			}
		});
	}

	onChangeText(e, newValue) {
		const { editionId } = this.props;
		const { textNodes } = this.state;
		const textElemIndex = parseInt(e.target.name.replace('_text', ''), 10);
		const editedTextNode = textNodes[textElemIndex];

		let editedTextNodeId = editedTextNode._id;
		if (typeof editedTextNodeId === 'object') {
			editedTextNodeId = editedTextNodeId.valueOf();
		}

		debounce(500, () => {
			// Call update method on meteor backend
			props.textNodesUpdate(editedTextNodeId, editionId, newValue, editedTextNode.n).then(
			(err, res) => {
				if (err) {
					console.error('Error editing text', err);
					this.showSnackBar(err.message);
				} else {
					this.showSnackBar('Updated');
				}
			});
		})();
	}

	showSnackBar(message) {
		this.setState({
			snackbarOpen: true,
			snackbarMessage: message,
		});
		this.timeout = setTimeout(() => {
			this.setState({
				snackbarOpen: false,
			});
		}, 4000);
	}
	componentWillUnmount() {
		if (this.timeout)			{ clearTimeout(this.timeout); }
	}
	render() {
		const { textNodes } = this.state;


		if (!this.props.ready) {
			return null;
		}

		return (
			<FormGroup
				controlId="textNodes"
				className="text-nodes-editor-text-input"
			>
				<ListGroupDnD>
					{textNodes.map((textNode, i) => (
						<ListGroupItemDnD
							key={textNode.n}
							index={i}
							className="form-subitem form-subitem--textNode text-node-input"
							moveListGroupItem={this.moveTextNodeBlock}
						>
							<div
								className="reference-work-item"
							>							
								<FormGroup className="text-node-number-input">
									<TextField
										name={`${i}_number`}
										hintText="0"
										defaultValue={textNode.n}
										style={{
											width: '40px',
											margin: '0 10px',
										}}
										onChange={this.onChangeN}
										disabled
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
										onChange={this.onChangeText}
									/>
								</FormGroup>
							</div>
						</ListGroupItemDnD>
						))}
				</ListGroupDnD>
				<RaisedButton
					label="Show more"
					className="text-nodes-input-action-button"
					onClick={this.props.loadMore}
				/>
				<Snackbar
					className="editor-snackbar"
					open={this.state.snackbarOpen}
					message={this.state.snackbarMessage}
					autoHideDuration={4000}
				/>
			</FormGroup>
		);
	}
}

TextNodesInput.propTypes = {
	textNodes: PropTypes.array,
	workId: PropTypes.string,
	workSlug: PropTypes.string,
	subworkTitle: PropTypes.string,
	subworkN: PropTypes.number,
	lineFrom: PropTypes.number,
	defaultTextNodes: PropTypes.array,
	editionId: PropTypes.string,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
	ready: PropTypes.bool,
	loadMore: PropTypes.func,
};


const TextNodesInputContainer = createContainer(props => {

	const { workId, workSlug, editionId, subworkN, lineFrom, limit } = props;
	const tenantId = Session.get('tenantId');

	let textNodes;
	let textNodesByEditions = [];
	let textNodesByEditionsSorted = [];
	let selectedEdition = { lines: [] };

	const ready = !props.textNodesQuery.loading;

	if (tenantId) {
		props.textNodesQuery.refetch({
			tenantId: tenantId,
			workSlug: workSlug === 'homeric-hymns' ? 'hymns' : workSlug,
			subworkN: subworkN,
			lineFrom: parseInt(lineFrom, 10),
			lineTo: parseInt(lineFrom, 10) + limit,
			editionId: editionId,
			limit: limit
		});
	}
	if (ready) {
		textNodes = props.textNodesQuery.loading ? [] : props.textNodesQuery.textNodes;
		textNodesByEditions = !props.editionsQuery.loading ?
			Utils.textFromTextNodesGroupedByEdition(textNodes, props.editionsQuery.editions) : [];
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

	const assignedTextNodes = [];

	for (let i = 0; i < limit; i++) {
		let newLine;
		const arrIndex = _.findIndex(selectedEdition.lines, (line) => line.n === i + parseInt(lineFrom));
		if (arrIndex >= 0) {
			newLine = selectedEdition.lines[arrIndex];
			assignedTextNodes.push(newLine);
		}
	}

	return {
		textNodes: assignedTextNodes,
		ready,
	};

}, TextNodesInput);

export default compose(
	editionsQuery,
	textNodesQuery,
	textNodeUpdateMutation)(TextNodesInputContainer);
