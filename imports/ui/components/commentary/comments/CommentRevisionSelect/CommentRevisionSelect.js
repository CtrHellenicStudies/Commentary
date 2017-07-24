import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import CommentCitation from '/imports/ui/components/commentary/comments/CommentCitation';

import moment from 'moment';

/*
	helpers
*/
const getDateRevision = (revision) => {
	if (revision.originalDate) return revision.originalDate;
	else if (revision.updated) return revision.updated;
	return revision.created;
};

const getClassName = (selectedRevisionIndex, i) => (`revision ${selectedRevisionIndex === i ? 'selected-revision' : ''}`);

const sortRevisions = (revisions) => (_.sortBy(revisions, 'created'));


/*
	BEGIN CommentRevisionSelect
*/
const CommentRevisionSelect = props => (
	<div className="comment-revisions">

		{!props.isTest && sortRevisions(props.comment.revisions).map((revision, i) => {

			const updated = getDateRevision(revision);

			return (
				<FlatButton
					key={revision._id}
					id={i}
					data-id={revision._id}
					className={getClassName(props.selectedRevisionIndex, i)}
					onClick={props.selectRevision}
					label={`Revision ${moment(updated).format('D MMMM YYYY')}`}
				/>
			);
		})}
		<CommentCitation
			comment={props.comment}
		/>
	</div>
);
CommentRevisionSelect.propTypes = {
	comment: React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		revisions: React.PropTypes.arrayOf(React.PropTypes.shape({
			_id: React.PropTypes.string.isRequired,
			created: React.PropTypes.instanceOf(Date),
			updated: React.PropTypes.instanceOf(Date),
			originalDate: React.PropTypes.instanceOf(Date),
		})).isRequired,
		urn: React.PropTypes.string.isRequired,
	}),
	selectedRevisionIndex: React.PropTypes.number.isRequired,
	selectRevision: React.PropTypes.func.isRequired,
	isTest: React.PropTypes.bool,
};
CommentRevisionSelect.defaultProps = {

};
/*
	END CommentRevisionSelect
*/

export default CommentRevisionSelect;
