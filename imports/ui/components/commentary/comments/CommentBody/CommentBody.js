import React from 'react';

// components
import CommentBodyText from '/imports/ui/components/commentary/comments/CommentBodyText';

// helpers
import { getRevisionDiff } from '../helpers';


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
	comment: React.PropTypes.shape({
		revisions: React.PropTypes.arrayOf(React.PropTypes.shape({
			text: React.PropTypes.string.isRequired,
		})),
	}).isRequired,
	revisionIndex: React.PropTypes.number.isRequired,
	selectedRevision: React.PropTypes.object.isRequired,
	onTextClick: React.PropTypes.func,
	searchTerm: React.PropTypes.string
};

CommentBody.defaultProps = {
	onTextClick: null,
};


export default CommentBody;
