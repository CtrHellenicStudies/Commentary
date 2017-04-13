import FlatButton from 'material-ui/FlatButton';
import CommentCitation from '/imports/ui/components/commentary/comments/CommentCitation';  // eslint-disable-line import/no-absolute-path

/*
	helpers
*/
const getDateRevision = (revision) => {
	if (revision.originalDate) return revision.originalDate;
	return revision.updated;
};

const getClassName = (selectedRevisionIndex, i) => (`revision ${selectedRevisionIndex === i ? 'selected-revision' : ''}`);


/*
	BEGIN CommentRevisionSelect
*/
const CommentRevisionSelect = props => (
	<div className="comment-revisions">
		{props.revisions.map((revision, i) => {

			const updated = getDateRevision(revision);

			return (
				<FlatButton
					key={revision.id}
					id={i}
					data-id={revision.id}
					className={getClassName(props.selectedRevisionIndex, i)}
					onClick={props.selectRevision}
					label={`Revision ${moment(updated).format('D MMMM YYYY')}`}
				/>
			);
		})}
		<CommentCitation
			commentId={props.commentId}
			revisions={props.revisions}
		/>
	</div>
);
CommentRevisionSelect.propTypes = {
	commentId: React.PropTypes.string.isRequired,
	revisions: React.PropTypes.arrayOf(React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		updated: React.PropTypes.instanceOf(Date).isRequired,
		originalDate: React.PropTypes.instanceOf(Date),
	})).isRequired,
	selectedRevisionIndex: React.PropTypes.number.isRequired,
	selectRevision: React.PropTypes.func.isRequired,
};
CommentRevisionSelect.defaultProps = {

};
/*
	END CommentRevisionSelect
*/

export default CommentRevisionSelect;
