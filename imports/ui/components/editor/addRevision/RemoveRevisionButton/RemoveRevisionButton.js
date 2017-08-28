import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

const removeRevision = () => {

};

const RemoveRevisionButton = props => {
	return (
		<div className="comment-edit-action-button comment-edit-action-button--remove">
			<RaisedButton
				label="Remove revision"
				labelPosition="after"
				onClick={removeRevision}
				icon={<FontIcon className="mdi mdi-minus" />}
			/>
		</div>
	);
}

export default RemoveRevisionButton;
