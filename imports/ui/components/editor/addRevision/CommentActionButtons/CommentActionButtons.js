import React from 'react';
import PropTypes from 'prop-types';
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

CommentActionButtons.propTypes = {
	commentId: PropTypes.string,
};

export default CommentActionButtons;
