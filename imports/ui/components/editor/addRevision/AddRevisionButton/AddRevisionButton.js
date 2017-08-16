import React from 'react';


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
