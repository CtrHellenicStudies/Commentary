import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import {
	ControlLabel,
	FormGroup,
	FormControl,
} from 'react-bootstrap';
import TranslationNodes from '/imports/models/translationNodes';

// components
import { ListGroupDnD, createListGroupItemDnD } from '/imports/ui/components/shared/ListDnD';

const ListGroupItemDnD = createListGroupItemDnD('translationNodeBlocks');

class TranslationNodeInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			textNodes: [],
			snackbarOpen: false,
			snackbarMessage: '',
		};
	}

	render() {
		const { translationNodes } = this.props;

		if (!this.props.ready) {
		    return null
		}

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
					{translationNodes.map((translationNode, i) => {
						return (
							<ListGroupItemDnD
								key={translationNode.n}
								index={i}
								className="form-subitem form-subitem--textNode text-node-input"
								moveListGroupItem={this.moveTextNodeBlock}
							>
								<div
									className="reference-work-item"
								>
									{/*
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
									 */}
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
				{/*
				 <RaisedButton
				 label="Add line of text"
				 className="text-nodes-input-action-button"
				 onClick={this.addTextNodeBlock}
				 />
				 */}
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


const TranslationInputContainer = createContainer(({ selectedWork, selectedSubwork, startAtLine, limit, selectedTranslation }) => {

	const tenantId = Session.get('tenantId');

	const translationNodeSubscription = Meteor.subscribe('translationNodes.work', tenantId, selectedWork, selectedSubwork, selectedTranslation, startAtLine, limit);
	const ready = translationNodeSubscription.ready();

	const translationNodes = TranslationNodes.find().fetch();

	return {
		ready,
		translationNodes
	};

}, TranslationNodeInput);

export default TranslationInputContainer;