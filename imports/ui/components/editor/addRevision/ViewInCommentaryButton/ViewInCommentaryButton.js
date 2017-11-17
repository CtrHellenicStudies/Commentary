import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import qs from 'qs-lite';

const ViewInCommentaryButton = props => (
	<div className="comment-action-button view-in-commentary">
		<FlatButton
			className="go-to-commentary-link"
			onClick={() => {
				const urlParams = qs.stringify({_id: commentId});
				this.props.history.push(`/commentary/${urlParams}`);
			}}
			style={{
				border: '1px solid #ddd',
				maxHeight: 'none',
				fontSize: '12px',
				height: 'auto',
			}}
			label="View in Commentary"
		/>
	</div>
);

export default ViewInCommentaryButton;
