import React from 'react';
import ViewInCommentaryButton from '../ViewInCommentaryButton';
import RemoveCommentButton from '../RemoveCommentButton';

const CommentActionButtons = props => (
	<div className="comment-action-buttons">
		<ViewInCommentaryButton
			commentId={props.commentId}
		/>
		<RemoveCommentButton
			commentId={props.commentId}
		/>
	</div>
);

export default CommentActionButtons;
