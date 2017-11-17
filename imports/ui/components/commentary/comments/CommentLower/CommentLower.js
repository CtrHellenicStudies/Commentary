import React from 'react';
import PropTypes from 'prop-types';
import CommentBody from '/imports/ui/components/commentary/comments/CommentBody';
import CommentReference from '/imports/ui/components/commentary/comments/CommentReference';

const CommentLower = props => (
	<div className="comment-lower">
		{!props.hideBody && <CommentBody
			comment={props.comment}
			revisionIndex={props.revisionIndex}
			selectedRevision={props.selectedRevision}
			onTextClick={props.onTextClick}
			searchTerm={props.searchTerm}
		/>}
		{!props.hideReference && <CommentReference
			referenceWorks={props.referenceWorks}
		/>}
	</div>
);

CommentLower.propTypes = {
	comment: PropTypes.shape({
		revisions: PropTypes.arrayOf(PropTypes.shape({
			text: PropTypes.string.isRequired,
		})),
	}).isRequired,
	selectedRevision: PropTypes.object.isRequired,
	revisionIndex: PropTypes.number.isRequired,
	onTextClick: PropTypes.func,
	referenceWorks: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
	hideBody: PropTypes.bool,
	hideReference: PropTypes.bool,
	searchTerm: PropTypes.string
};

CommentLower.defaultProps = {
	onTextClick: null,
	referenceWorks: null,
	hideBody: false,
	hideReference: false,
};

export default CommentLower;
