import React from 'react';
import PropTypes from 'prop-types';

// components
import CommentBodyText from '../CommentBodyText';

// lib
import getRevisionDiff from '../../../lib/getRevisionDiff';


const CommentBody = (props) => {

	if (props.revisionIndex === 0) {
		return (
			<CommentBodyText
				text={props.selectedRevision ? props.selectedRevision.text : ''}
				onTextClick={props.onTextClick}
				createRevisionMarkup
				searchTerm={props.searchTerm}
			/>
		);
	}

	return (
		<CommentBodyText
			text={getRevisionDiff(props.comment, props.revisionIndex).innerHTML}
			searchTerm={props.searchTerm}
		/>
	);
};

CommentBody.propTypes = {
	comment: PropTypes.shape({
		revisions: PropTypes.arrayOf(PropTypes.shape({
			text: PropTypes.string.isRequired,
		})),
	}).isRequired,
	revisionIndex: PropTypes.number.isRequired,
	selectedRevision: PropTypes.object.isRequired,
	onTextClick: PropTypes.func,
	searchTerm: PropTypes.string
};

CommentBody.defaultProps = {
	onTextClick: null,
};


export default CommentBody;
