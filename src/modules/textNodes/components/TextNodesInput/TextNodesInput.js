import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'react-apollo';
import { FormGroup } from 'react-bootstrap';
import update from 'immutability-helper';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import { debounce } from 'throttle-debounce';

// lib:

// graphql
import { editionsQuery } from '../../../textNodes/graphql/queries/editions';
import textNodeUpdateMutation from '../../graphql/mutations/textNodesUpdate';

// components
import { ListGroupDnD, createListGroupItemDnD } from '../../../shared/components/ListDnD/ListDnD';

import './TextNodesInput.css';


const ListGroupItemDnD = createListGroupItemDnD('textNodeBlocks');

const getSelectedEditionText = (textNodes) => {
	let selectedEditionText = { lines: [], slug: '', title: '' };
	selectedEditionText.title = textNodes[0].version.title;
	selectedEditionText.slug = textNodes[0].version.slug;
	textNodes.forEach(textNode => {
		selectedEditionText.lines.push({
			n: textNode.location[0],
			html: textNode.text,
		});
	});
	return selectedEditionText;
};
class TextNodesInput extends Component {

	constructor(props) {
		super(props);
		this.state = {
			snackbarOpen: false,
			snackbarMessage: '',
			ready: false
		};

		this.onChangeN = this.onChangeN.bind(this);
		this.onChangeText = this.onChangeText.bind(this);
		this.addTextNodeBlock = this.addTextNodeBlock.bind(this);
		this.removeTextNodeBlock = this.removeTextNodeBlock.bind(this);
		this.moveTextNodeBlock = this.moveTextNodeBlock.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
	}

	componentWillReceiveProps(props) {

		this.setState({
			textNodes: props.textNodes,
		});

	}

	addTextNodeBlock() {
		const { workId, workSlug, editionId, subworkN, subworkTitle } = this.props;
		const defaultN = 1;

		this.state.textNodes.push({
			_id: Date.now(),
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
			tenantId: sessionStorage.getItem('tenantId'),
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
			this.props.textNodesUpdate(editedTextNodeId, editionId, newValue, editedTextNode.n).then(
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
		const { textNodes } = this.props;


		if (!textNodes || !textNodes.length) {
			return null;
		}
		console.log(textNodes);
		return (
			<FormGroup
				controlId="textNodes"
				className="text-nodes-editor-text-input"
			>
				<ListGroupDnD>
					{getSelectedEditionText(textNodes).lines.map((line, i) => (
						<ListGroupItemDnD
							key={i}
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
										defaultValue={line.n}
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
										defaultValue={line.html}
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
	workId: PropTypes.string,
	workSlug: PropTypes.string,
	subworkTitle: PropTypes.string,
	subworkN: PropTypes.number,
	locationStart: PropTypes.string,
	locationEnd: PropTypes.string,
	defaultTextNodes: PropTypes.array,
	editionId: PropTypes.string,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
	loadMore: PropTypes.func,
	textNodes: PropTypes.array,
	editionsQuery: PropTypes.object,
	textNodeUpdate: PropTypes.func,
	limit: PropTypes.number
};

export default compose(
	editionsQuery,
	textNodeUpdateMutation)(TextNodesInput);
