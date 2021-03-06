import React from 'react';
import PropTypes from 'prop-types';
import {
	ControlLabel,
	FormGroup,
} from 'react-bootstrap';
import Select from 'react-select';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// components
import AddTranslationDialog from '../AddTranslationDialog/AddTranslationDialog';


class TranslationSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedTranslation: null,
			editDialogOpen: false,
			translationOptions: []
		};

		autoBind(this);
	}

	selectTranslation(event) {
		const setValue = event ? event.value : '';
		this.setState({
			selectedTranslation: setValue
		});
		this.props.selectTranslation(setValue);
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
				<AddTranslationDialog
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
	selectedWork: PropTypes.number,
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	// translationAuthorsQuery,
	connect(mapStateToProps),
)(TranslationSelect);
