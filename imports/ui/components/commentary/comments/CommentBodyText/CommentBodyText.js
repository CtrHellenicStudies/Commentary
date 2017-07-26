import React from 'react';
import TextHighlight from 'react-text-highlight';

// lib
import createRevisionMarkup from '/imports/lib/createRevisionMarkup';

/*
	BEGIN CommentBodyText
*/
const CommentBodyText = props => (
	<div
		className="comment-body"
		onClick={props.onTextClick}
	>
		<div>
			<TextHighlight
				highlight="ago"
				text={props.text}
			/>
		</div>
	</div>
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
