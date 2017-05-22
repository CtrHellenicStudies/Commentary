import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

const LinkButtonDialog = ({ open, linkValue, handleClose, handleAddLink, handleRemoveLink, onValueChange }) => {
	const actions = [
		<FlatButton
			label="Cancel"
			primary
			onClick={handleClose}
		/>,
		<FlatButton
			label="Remove link"
			primary
			onClick={handleRemoveLink}
		/>,
		<FlatButton
			label="Add link"
			primary
			onClick={handleAddLink}
		/>,
	];

	return (
		<Dialog
			title="Add link"
			actions={actions}
			open={open}
			onRequestClose={handleClose}
		>
			<TextField
				hintText="URL"
				fullWidth
				defaultValue={linkValue}
				onChange={onValueChange}
			/>
		</Dialog>
	);
};
LinkButtonDialog.propTypes = {
	open: React.PropTypes.bool.isRequired,
	linkValue: React.PropTypes.string,
	handleClose: React.PropTypes.func.isRequired,
	handleAddLink: React.PropTypes.func.isRequired,
	handleRemoveLink: React.PropTypes.func.isRequired,
	onValueChange: React.PropTypes.func.isRequired,
};
LinkButtonDialog.defaultProps = {
	linkValue: '',
};

export default LinkButtonDialog;
