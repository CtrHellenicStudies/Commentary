import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import _ from 'underscore';


class EditSubworkDialog extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			subwork: {},
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!_.isEqual(nextProps.subwork, this.state.subwork)) {
			this.setState({
				subwork: nextProps.subwork,
			});
		}
	}

	render() {
		const { subwork } = this.state;

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
        onClick={this.props.handleClose}
      />,
    ];

		return (
      <Dialog
        title={
					subwork && '_id' in subwork
					? 'Edit Subwork'
					: 'Create Subwork'
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
							name="subwork_title"
							defaultValue={subwork ? subwork.title : ''}
							fullWidth
						/>
					</div>
					<div className="edit-form-input">
						<label>
							Number
						</label>
						<TextField
							name="subwork_title"
							defaultValue={subwork ? subwork.n : ''}
							fullWidth
						/>
					</div>
				</div>
      </Dialog>
		);
	}
}

export default EditSubworkDialog;
