import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';  // eslint-disable-line import/no-absolute-path
import s from './CommentUpper.css';

/*
	helpers
*/

const getRevision = (comment, index) => (comment.revisions[index]);

const getUserCommenterId = () => {
	if (Meteor.user() && Meteor.user().canEditCommenters) {
		return Meteor.user().canEditCommenters;
	}
	return [];
};

const getUpdateDate = (selectedRevision) => {
	let updated = selectedRevision.updated;
	if (selectedRevision.originalDate) {
		updated = selectedRevision.originalDate;
	}
	const format = 'D MMMM YYYY';
	return moment(updated).format(format);
};



/*
	BEGIN CommentUpperLeft 
*/
const CommentUpperLeft = props => (
	<div className={s['comment-upper-left']}>
		<h1>{props.title}</h1>
	</div>
);
CommentUpperLeft.propTypes = {
	title: React.PropTypes.string.isRequired,
};
/*
	END CommentUpperLeft 
*/



/*
	BEGIN CommentUpperRight 
*/
const CommentUpperRight = props => (
	<div className={s['comment-upper-right']}>
		{props.comment.commenters.map(commenter => (
			<div
				key={commenter._id}
				className="comment-author"
			>
				{getUserCommenterId().indexOf(commenter._id) > -1 ?
					<FlatButton
						label="Edit comment"
						href={`/commentary/${comment._id}/edit`}
						icon={<FontIcon className="mdi mdi-pen" />}
					/>
					:
					''
				}
				<div className={s['comment-author-text']}>
					<a href={`/commenters/${commenter.slug}`}>
						<span className={s['comment-author-name']}>{commenter.name}</span>
					</a>
					<span>
						{props.updateDate}
					</span>
				</div>
				<div className={`${s['comment-author-image-wrap']} paper-shadow`}>
					<a href={`/commenters/${commenter.slug}`}>
						<AvatarIcon
							avatar={
								(commenter && 'avatar' in commenter) ?
								commenter.avatar.src
								: null
							}
						/>
					</a>
				</div>
			</div>
		))}
	</div>
);
CommentUpperRight.propTypes = {
	comment: React.PropTypes.object.isRequired,
	updateDate: React.PropTypes.string.isRequired,
};
/*
	END CommentUpperRight 
*/



/*
	BEGIN CommentUpperRight 
*/
const CommentUpper = (props) => {

	const revision = getRevision(props.comment, props.selectedRevisionIndex);

	return (
		<div className={s['comment-upper']}>
			<CommentUpperLeft
				title={revision.title}
			/>
			<CommentUpperRight
				comment={props.comment}
				updateDate={getUpdateDate(revision)}
			/>
		</div>
	);
};
CommentUpper.propTypes = {
	selectedRevisionIndex: React.PropTypes.number.isRequired,
	comment: React.PropTypes.object.isRequired,
};
/*
	END CommentUpperRight 
*/

export default CommentUpper;
export { CommentUpperLeft, CommentUpperRight };
