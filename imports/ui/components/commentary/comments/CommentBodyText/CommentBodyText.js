import React from 'react';

// lib
import createRevisionMarkup from '/imports/lib/createRevisionMarkup';

/*
	BEGIN CommentBodyText
*/
const CommentBodyText = props => (
	<div
		className="comment-body"
		dangerouslySetInnerHTML={props.createRevisionMarkup ? createRevisionMarkup(props.text) : { __html: props.text }}
		onClick={props.onTextClick}
	/>
);
CommentBodyText.propTypes = {
	text: React.PropTypes.string.isRequired,
	onTextClick: React.PropTypes.func,
	createRevisionMarkup: React.PropTypes.bool,
};
CommentBodyText.defaultProps = {
	onTextClick: null,
	createRevisionMarkup: false,
};
/*
	END CommentBodyText
*/

export default CommentBodyText;
