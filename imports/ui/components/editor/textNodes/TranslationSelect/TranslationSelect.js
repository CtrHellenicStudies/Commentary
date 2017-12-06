import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import {
	ControlLabel,
	FormGroup,
} from 'react-bootstrap';
import Select from 'react-select';
import { compose } from 'react-apollo';


// graphql
import { translationAuthorsQuery } from '/imports/graphql/methods/translations';

import EditTranslationAuthorDialog from '../EditTranslationAuthorDialog/EditTranslationAuthorDialog';

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

		this.props.translationOptions.map(translation => {
			translationOptions.push({
				value: translation.author,
				label: translation.author,
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

					{ this.props.workDetails && !this.state.selectedTranslation ?
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

TranslationSelect.propTypes = {
	selectTranslation: PropTypes.func,
	workDetails: PropTypes.object,
	translationOptions: PropTypes.array,
};

const TranslationSelectContainer = createContainer(props => {

	let workDetails = null;
	const translationOptions = props.translationAuthorsQuery.loading ? [] : props.translationAuthorsQuery.authors;

	if (props.selectedWork && props.selectedSubwork) {
		props.translationAuthorsQuery.refetch({
			selectedWork: props.selectedWork,
			selectedSubwork: props.selectedSubwork
		});
		workDetails = {
			tenantId: sessionStorage.getItem('tenantId'),
			work: props.selectedWork,
			subwork: props.selectedSubwork,
		};
	}

	return {
		workDetails,
		translationOptions,
	};

}, TranslationSelect);

export default compose(translationAuthorsQuery)(TranslationSelectContainer);
