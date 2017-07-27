import React from 'react';
import Highlighter from 'react-highlight-words';

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
			<Highlighter
				searchWords={props.searchTerm.values}
				textToHighlight={props.text}
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
