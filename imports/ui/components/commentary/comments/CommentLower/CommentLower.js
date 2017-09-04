import React from 'react';
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
	comment: React.PropTypes.shape({
		revisions: React.PropTypes.arrayOf(React.PropTypes.shape({
			text: React.PropTypes.string.isRequired,
		})),
	}).isRequired,
	selectedRevision: React.PropTypes.object.isRequired,
	revisionIndex: React.PropTypes.number.isRequired,
	onTextClick: React.PropTypes.func,
	referenceWorks: React.PropTypes.arrayOf(React.PropTypes.shape({
		title: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
	})),
	hideBody: React.PropTypes.bool,
	hideReference: React.PropTypes.bool,
	searchTerm: React.PropTypes.string
};

CommentLower.defaultProps = {
	onTextClick: null,
	referenceWorks: null,
	hideBody: false,
	hideReference: false,
};

export default CommentLower;
