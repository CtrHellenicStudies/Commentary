import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';


const AddRevisionButton = props => {
	return (
		<div className="comment-edit-action-button">
			<RaisedButton
				type="submit"
				label="Add revision"
				labelPosition="after"
				icon={<FontIcon className="mdi mdi-plus" />}
			/>
		</div>
	)
}

export default AddRevisionButton;
