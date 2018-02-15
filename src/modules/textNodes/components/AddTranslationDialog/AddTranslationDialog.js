import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { compose } from 'react-apollo';

// graphql
import translationCreateMutation from '../../graphql/mutations/textNodesCreate';

class AddTranslationDialog extends Component {

	constructor(props) {
		super(props);
		this.state = {		
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.setTitle = this.setTitle.bind(this);
		this.setDecription = this.setDescription.bind(this);
		this.setSlug = this.setSlug.bind(this);
		this.setUrn = this.setUrn.bind(this);
	}
	setTitle(event) {
		this.setState({
			title: event.target.value
		});
	}
	setSlug(event) {
		this.setState({
			slug: event.target.value
		});
	}
	setDescription(event) {
		this.setState({
			descrition: event.target.value
		});
	}
	setUrn(event) {
		this.setState({
			urn: event.target.value
		});
	}
	handleSubmit() {
		if (this.state.title 
		&& this.state.slug
		&& this.state.urn) {
			const translation = {
				slug: this.state.slug,
				title: this.state.title,
				description: this.state.description ? this.state.description : '',
				urn: this.state.urn
			};
			this.props.translationCreate(translation).then(function(result){
				console.log(result);
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
						? 'Edit translation'
						: 'Create translation'
				}
				actions={actions}
				modal={false}
				open={this.props.open}
				onRequestClose={this.props.handleClose}
			>
				<div className="text-node-editor-meta-form edit-subwork-form">
					<div className="edit-form-input">
						<label>
							Title
						</label>
						<TextField
							name="translation_title"
							defaultValue={translation || ''}
							onChange={this.setTitle}
							fullWidth
						/>
					</div>
					<div className="edit-form-input">
						<label>
							Description
						</label>
						<TextField
							name="translation_description"
							defaultValue={translation || ''}
							onChange={this.setDecription}
							fullWidth
						/>
					</div>
					<div className="edit-form-input">
						<label>
							slug
						</label>
						<TextField
							name="translation_slug"
							defaultValue={translation || ''}
							onChange={this.setSlug}
							fullWidth
						/>
					</div>
					<div className="edit-form-input">
						<label>
							Urn
						</label>
						<TextField
							name="translation_urn"
							defaultValue={translation || ''}
							onChange={this.setUrn}
							fullWidth
						/>
					</div>

				</div>
			</Dialog>
		);
	}
}

AddTranslationDialog.propTypes = {
	workDetails: PropTypes.object,
	addNewAuthor: PropTypes.func,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
	translation: PropTypes.string,
	translationAddAuthor: PropTypes.func,
	translationUpdateAuthor: PropTypes.func
};

export default compose(translationCreateMutation)(AddTranslationDialog);
