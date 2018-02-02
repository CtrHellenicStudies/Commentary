import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	ControlLabel,
	FormGroup,
} from 'react-bootstrap';
import Select from 'react-select';
import { compose } from 'react-apollo';


// graphql
import { translationAuthorsQuery } from '../../../graphql/methods/translations';

import EditTranslationAuthorDialog from '../dialog/EditTranslationAuthorDialog';

class TranslationSelect extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTranslation: null,
			editDialogOpen: false,
			translationOptions: []
		};
		this.selectTranslation = this.selectTranslation.bind(this);
		this.showEditDialog = this.showEditDialog.bind(this);
		this.handleCloseEditDialog = this.handleCloseEditDialog.bind(this);
		this.addNewAuthor = this.addNewAuthor.bind(this);

		if (this.props.selectedSubwork && this.props.selectedWork) {
			this.props.translationAuthorsQuery.refetch({
				selectedWork: this.props.selectedWork,
				selectedSubwork: this.props.selectedSubwork
			});
		}
	}
	componentWillReceiveProps(props) {
		let workDetails = null;
		const translationOptions = props.translationAuthorsQuery.loading ? [] : props.translationAuthorsQuery.authorsOfTranslations;
	
		if (props.selectedWork !== this.props.selectedWork || 
			props.selectedSubwork !== this.props.selectedSubwork) {
			if (props.selectedSubwork && props.selectedWork) {
				props.translationAuthorsQuery.refetch({
					selectedWork: props.selectedWork,
					selectedSubwork: props.selectedSubwork
				});
			}
			workDetails = {
				tenantId: sessionStorage.getItem('tenantId'),
				work: props.selectedWork,
				subwork: props.selectedSubwork,
			};
		}
		this.setState({
			workDetails: workDetails,
			translationOptions: translationOptions
		});
	}
	selectTranslation(event) {
		const setValue = event ? event.value : '';
		this.setState({
			selectedTranslation: setValue
		});
		this.props.selectTranslation(setValue);
	}

	componentWillUnmount() {
		if (sessionStorage.keys && sessionStorage.keys.translationOptions) {
			delete sessionStorage.keys.translationOptions;
		}
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
		const currentAuthors = this.prop.translationOptions;
		currentAuthors.push(newAuthor);
		this.setState({
			selectedTranslation: newAuthor
		});
		this.props.selectTranslation(newAuthor);
		// TODO insert author
	}

	render() {
		const {selectedTranslation} = this.state;
		const translationOptions = [];
		const workDetails = this.props.workDetails;

		this.state.translationOptions.map(translation => {
			translationOptions.push({
				value: translation.author,
				label: translation.author,
			});
			return true;
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

					{ !this.state.selectedTranslation ?
						<button
							onClick={this.showEditDialog}
						>
						Add new translation
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

TranslationSelect.propTypes = {
	selectTranslation: PropTypes.func,
	workDetails: PropTypes.object,
	translationAuthorsQuery: PropTypes.object,
	selectedSubwork: PropTypes.number,
	selectedWork: PropTypes.string
};

export default compose(translationAuthorsQuery)(TranslationSelect);
