import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {
	ControlLabel,
	FormGroup,
} from 'react-bootstrap';
import Select from 'react-select';
import {Session} from 'meteor/session';
import EditTranslationAuthorDialog from "../EditTranslationAuthorDialog/EditTranslationAuthorDialog";

class TranslationSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTranslation: null,
			editDialogOpen: false
		};
		this.selectTranslation = this.selectTranslation.bind(this);
		this.showEditDialog = this.showEditDialog.bind(this);
		this.handleCloseEditDialog = this.handleCloseEditDialog.bind(this);
		this.addNewAuthor = this.addNewAuthor.bind(this);
	}

	selectTranslation(event) {
		const setValue = event ? event.value : '';
		this.setState({
			selectedTranslation: setValue
		});
		this.props.selectTranslation(setValue);
	}

	componentWillUnmount() {
		delete Session.keys.translationOptions;
	}

	showEditDialog() {
		this.setState({
			editDialogOpen: true,
		});
	}

	handleCloseEditDialog() {
		this.setState({
			editDialogOpen: false,
		});
	}

	addNewAuthor(newAuthor) {
		const currentAuthors = Session.get('translationOptions');
		currentAuthors.push(newAuthor);
		this.setState({
			selectedTranslation: newAuthor
		});
		this.props.selectTranslation(newAuthor);
		Session.set('translationOptions', currentAuthors);
	}

	render() {
		const {selectedTranslation} = this.state;
		const translationOptions = [];
		const workDetails = this.props.workDetails;

		this.props.translationOptions.map(translation => {
			translationOptions.push({
				value: translation,
				label: translation,
			});
		});

		return (
			<div className="text-nodes-editor-meta-input translation-input">
				<FormGroup controlId="formControlsSelect">
					<ControlLabel>Translation</ControlLabel>
					<Select
						name="subwork-select"
						value={selectedTranslation}
						options={translationOptions}
						onChange={this.selectTranslation}
					/>

					{ this.props.workDetails ?
					<button
						onClick={this.showEditDialog}
					>
						Add new author
					</button> : ''
					}
					{this.state.selectedTranslation ?
						<button
							onClick={this.showEditDialog}
						>
							Edit {selectedTranslation}
						</button>
						: ' '}


				</FormGroup>
				<EditTranslationAuthorDialog
					open={this.state.editDialogOpen}
					handleClose={this.handleCloseEditDialog}
					translation={this.state.selectedTranslation}
					addNewAuthor={this.addNewAuthor}
					workDetails={workDetails}
				/>
			</div>
		);
	}
}

const TranslationSelectContainer = createContainer(props => {
	const translationOptions = Session.get('translationOptions') ? Session.get('translationOptions') : [];

	let workDetails = null;

	if (props.selectedWork && props.selectedSubwork) {
		Meteor.call('translationNodes.getAuthors', Session.get('tenantId'), props.selectedWork, props.selectedSubwork, (err, result) => {
			if (!err) {
				Session.set('translationOptions', result);
			} else {
				throw new Error(err);
			}
		});
		workDetails = {
			tenantId: Session.get('tenantId'),
			work: props.selectedWork,
			subwork: props.selectedSubwork,
		};
	}

	return {
		workDetails,
		translationOptions,
	};

}, TranslationSelect);

export default TranslationSelectContainer;
