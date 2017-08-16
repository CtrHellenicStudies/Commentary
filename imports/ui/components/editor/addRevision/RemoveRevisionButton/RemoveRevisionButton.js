import React from 'react';

cont RemoveRevisionButton = props => {
	return (
		<div className="comment-edit-action-button comment-edit-action-button--remove">
			<RaisedButton
				label="Remove revision"
				labelPosition="after"
				onClick={this.removeRevision}
				icon={<FontIcon className="mdi mdi-minus" />}
			/>
		</div>
	)
}

export default RemoveRevisionButton;
