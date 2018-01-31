import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { compose } from 'react-apollo';

// graphql
import { translationAddAuthorMutation, translationUpdateAuthorMutation } from '../../../graphql/methods/translations';

class EditTranslationAuthorDialog extends Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setValue = this.setValue.bind(this);
		this.state = {
			authorName: this.props.translation
		};
	}
	setValue(event) {
		this.setState({
			authorName: event.target.value
		});
	}
	handleSubmit() {
		if (this.state.authorName && !this.props.translation) {
			this.props.translationAddAuthor(this.props.workDetails, this.state.authorName)
			.then((err, result) => {
				if (!err) {
					this.props.addNewAuthor(this.state.authorName);
					this.props.handleClose();
				} else {
					throw new Error(err);
				}
			});
		}		else if (this.state.authorName) {
			this.props.translationUpdateAuthor(this.props.workDetails, this.props.translation, this.state.authorName)
			.then((err, result) => {
				if (!err) {
					this.props.addNewAuthor(this.state.authorName);
					this.props.handleClose();
				} else {
					throw new Error(err);
				}
			});
		}
	}

	render() {
		const { translation } = this.props;

		const actions = [
			<FlatButton
				label="Cancel"
				primary
				onClick={this.props.handleClose}
			/>,
			<FlatButton
				label="Submit"
				primary
				keyboardFocused
				onClick={this.handleSubmit}
			/>,
		];

		return (
			<Dialog
				title={
					translation
						? 'Edit Author'
						: 'Create Author'
				}
				actions={actions}
				modal={false}
				open={this.props.open}
				onRequestClose={this.props.handleClose}
			>
				<div className="text-node-editor-meta-form edit-subwork-form">
					<div className="edit-form-input">
						<label>
							Author
						</label>
						<TextField
							name="translation_author"
							defaultValue={translation || ''}
							onChange={this.setValue}
							fullWidth
						/>
					</div>

				</div>
			</Dialog>
		);
	}
}

EditTranslationAuthorDialog.propTypes = {
	workDetails: PropTypes.object,
	addNewAuthor: PropTypes.func,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
	translation: PropTypes.string,
	translationAddAuthor: PropTypes.func,
	translationUpdateAuthor: PropTypes.func
};

export default compose(translationAddAuthorMutation, translationUpdateAuthorMutation)(EditTranslationAuthorDialog);