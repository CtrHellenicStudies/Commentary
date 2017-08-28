import React from 'react';
import FlatButton from 'material-ui/FlatButton';


const ViewInCommentaryButton = props => (
	<div className="comment-upper-action-button view-in-commentary">
		<FlatButton
			className="go-to-commentary-link"
			onClick={() => {
				FlowRouter.go('/commentary/', {}, {_id: commentId});
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
