import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import _ from 'underscore';


class EditEditionDialog extends Component {

	constructor(props) {
		super(props);

		this.state = {
			edition: {},
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(nextProps.edition, this.state.edition)) {
			this.setState({
				edition: nextProps.edition,
			});
		}
	}

	render() {
		const { edition } = this.state;

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
				onClick={this.props.handleClose}
			/>,
		];

		return (
			<Dialog
				title={
					edition && '_id' in edition
					? 'Edit Edition'
					: 'Create Edition'
				}
				actions={actions}
				modal={false}
				open={this.props.open}
				onRequestClose={this.props.handleClose}
			>
				<div className="text-node-editor-meta-form edit-edition-form">
					<div className="edit-form-input">
						<label>
							Title
						</label>
						<TextField
							name="edition_title"
							defaultValue={edition ? edition.title : ''}
							fullWidth
						/>
					</div>
				</div>
			</Dialog>
		);
	}
}

EditEditionDialog.propTypes = {
	edition: PropTypes.object,
	handleClose: PropTypes.func,
	open: PropTypes.bool,
};

export default EditEditionDialog;
