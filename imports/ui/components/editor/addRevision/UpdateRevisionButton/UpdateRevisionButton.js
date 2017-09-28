import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

const handleUpdate = () => {

};

const UpdateRevisionButton = props => (
	<div className="comment-edit-action-button">
		<RaisedButton
			label="Update without adding Revision"
			labelPosition="after"
			icon={<FontIcon className="mdi mdi-plus" />}
			onClick={handleUpdate}
		/>
	</div>
	);


export default UpdateRevisionButton;
