import CommentBody from '/imports/ui/components/commentary/comments/CommentBody';  // eslint-disable-line import/no-absolute-path
import CommentReference from '/imports/ui/components/commentary/comments/CommentReference';  // eslint-disable-line import/no-absolute-path

const CommentLower = props => (
	<div className="comment-lower">
		{!props.hideBody && <CommentBody
			comment={props.comment}
			revisionIndex={props.revisionIndex}
			onTextClick={props.onTextClick}
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
	revisionIndex: React.PropTypes.number.isRequired,
	onTextClick: React.PropTypes.func,
	referenceWorks: React.PropTypes.arrayOf(React.PropTypes.shape({
		title: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
	})),
	hideBody: React.PropTypes.bool,
	hideReference: React.PropTypes.bool,
};
CommentLower.defaultProps = {
	onTextClick: null,
	referenceWorks: null,
	hideBody: false,
	hideReference: false,
};

export default CommentLower;