import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import Cookies from 'js-cookie';

class EditTranslationAuthorDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.setValue = this.setValue.bind(this);
		this.state = {
			authorName: this.props.selectedTranslation
		}
	}
	setValue(event) {
		this.setState({
			authorName: event.target.value
		});
	}
	handleSubmit() {
		if (this.state.authorName) {
			Meteor.call('translationNodes.addAuthor', Cookies.get('loginToken'), this.props.workDetails, this.state.authorName, (err, result) => {
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
		const { translation } = this.state;

		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onClick={this.props.handleClose}
			/>,
			<FlatButton
				label="Submit"
				primary={true}
				keyboardFocused={true}
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
							defaultValue={translation ? translation : ''}
							onChange={this.setValue}
							fullWidth
						/>
					</div>

				</div>
			</Dialog>
		);
	}
}

export default EditTranslationAuthorDialog;
