import React from 'react';

const UpdateRevisionButton = props => {

	return (
		<div className="comment-edit-action-button">
			<RaisedButton
				label="Update without adding Revision"
				labelPosition="after"
				icon={<FontIcon className="mdi mdi-plus" />}
				onClick={this.handleUpdate}
			/>
		</div>
	);
}
