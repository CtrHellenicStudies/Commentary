import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import _ from 'underscore';


class EditWorkDialog extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			work: {},
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(nextProps.work, this.state.work)) {
			this.setState({
				work: nextProps.work,
			});
		}
	}

	render() {
		const { work } = this.state;

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
					work && '_id' in work
					? 'Edit Work'
					: 'Create Work'
				}
				actions={actions}
				modal={false}
				open={this.props.open}
				onRequestClose={this.props.handleClose}
			>
				<div className="text-node-editor-meta-form edit-work-form">
					<div className="edit-form-input">
						<label>
							Title
						</label>
						<TextField
							name="work_title"
							defaultValue={work ? work.title : ''}
							fullWidth
						/>
					</div>
				</div>
			</Dialog>
		);
	}
}

export default EditWorkDialog;
