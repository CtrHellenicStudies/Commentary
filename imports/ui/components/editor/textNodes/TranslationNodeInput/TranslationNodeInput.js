import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import {
	FormGroup,
} from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import _ from 'lodash';
import {debounce} from 'throttle-debounce';
import Cookies from 'js-cookie';

import TextNodes from '/imports/models/textNodes';
import TranslationNodes from '/imports/models/translationNodes';
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';

const ListGroupItemDnD = createListGroupItemDnD('translationNodeBlocks');

class TranslationNodeInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			translationNodes: this.props.translationNodes,
			snackbarOpen: false,
			snackbarMessage: '',
			inserting: false,
		};
		this.onChangeText = this.onChangeText.bind(this);
		this.showSnackBar = this.showSnackBar.bind(this);
		this.moveTextNodeBlock = this.moveTextNodeBlock.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			translationNodes: nextProps.translationNodes,
		});
	}

	onChangeText(event, newValue) {
		const index = parseInt(event.target.name.replace('_text', ''), 10);
		const currentTranslationNode = this.state.translationNodes[index];

		currentTranslationNode.text = newValue;

		if (newValue && !this.state.inserting) {
			this.setState({
				inserting: true
			});

			debounce(500, () => {
				// Call update method on meteor backend
				Meteor.call('translationNode.update', Cookies.get('loginToken'), currentTranslationNode,
					(err, res) => {
						if (err) {
							console.error('Error editing text', err);
							this.showSnackBar(err.message);
						} else {
							this.showSnackBar('Updated');
							this.setState({
								inserting: false
							});
						}
					});
			})();
		} else if (!newValue && !this.state.inserting) {
			this.setState({
				inserting: true
			});
			debounce(500, () => {
				// Call update method on meteor backend
				Meteor.call('translationNode.remove', Cookies.get('loginToken'), currentTranslationNode._id, (err, res) => {
					if (err) {
						console.error('Error removing text', err);
						this.showSnackBar(err.message);
					} else {
						this.showSnackBar('Deleted');
						this.setState({
							inserting: false
						});
					}
				});
			})();
		}
	}

	moveTextNodeBlock() {

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
		const {translationNodes} = this.state;

		if (!this.props.ready) {
			return null;
		}

		const subdomain = window.location.hostname.split('.')[0];

		return (
			<FormGroup
				controlId="textNodes"
				className="text-nodes-editor-text-input"
			>
				<ListGroupDnD>
					{translationNodes.map((translationNode, i) => (
						<ListGroupItemDnD
							key={`${translationNode.author.replace(' ', '')}${i}`}
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
										defaultValue={translationNode.n}
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
										defaultValue={translationNode.text}
										style={{
											width: '700px',
											margin: '0 10px',
										}}
										onChange={this.onChangeText}
										multiLine={subdomain === 'pausanias'}
									/>
								</FormGroup>
							</div>
						</ListGroupItemDnD>
						))}
				</ListGroupDnD>
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

TranslationNodeInput.propTypes = {
	translationNodes: PropTypes.array,
	ready: PropTypes.bool,
};

const TranslationInputContainer = createContainer(({selectedWork, selectedSubwork, startAtLine, startAtSection, limit, selectedTranslation, selectedEdition}) => {
	const tenantId = Session.get('tenantId');

	const lemmaQuery = {
		'work.slug': selectedWork.slug,
		'subwork.n': selectedSubwork,
		$and: [{'text.n': {$gte: parseInt(startAtLine, 10)}}, {'text.n': {$lte: parseInt(startAtLine, 10) + limit}}],
		'text.edition': selectedEdition,
	};
	if (startAtSection) {
		lemmaQuery['section.n'] = startAtSection;
	}

	if (lemmaQuery['work.slug'] === 'homeric-hymns') {
		lemmaQuery['work.slug'] = 'hymns';
	}
	let textNodes = [];
	const textNodeSubscription = Meteor.subscribe('textNodes', lemmaQuery, 0, limit);

	const translationNodes = [];
	let translation = [];
	const translationNodeSubscription = Meteor.subscribe('translationNodes.work', tenantId, selectedWork._id, selectedSubwork, selectedTranslation, startAtSection, startAtLine, limit);


	const ready = textNodeSubscription.ready() && translationNodeSubscription.ready();

	if (ready) {
		textNodes = TextNodes.find(lemmaQuery).fetch();
		translation = TranslationNodes.find().fetch();
	}

	if (textNodes && textNodes.length) {
		for (let i = 0; i < textNodes.length; i++) {
			let newLine;
			const arrIndex = _.findIndex(translation, (line) => line.n === i + parseInt(startAtLine));

			if (arrIndex >= 0) {
				newLine = translation[arrIndex];
			}		else {
				newLine = {
					n: i + parseInt(startAtLine),
					section: startAtSection,
					text: '',
					tenantId: tenantId,
					work: selectedWork.slug,
					subwork: selectedSubwork,
					author: selectedTranslation,
				};
			}

			translationNodes.push(newLine);
		}
	}

	return {
		ready,
		translationNodes
	};

}, TranslationNodeInput);

export default TranslationInputContainer;