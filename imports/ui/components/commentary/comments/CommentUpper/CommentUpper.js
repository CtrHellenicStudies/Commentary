import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';  // eslint-disable-line import/no-absolute-path
import FontIcon from 'material-ui/FontIcon';

import s from './CommentUpper.css';


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
		{props.commenters.map(commenter => (
			<div
				key={commenter._id}
				className="comment-author"
			>
				{props.userCanEditCommenters.indexOf(commenter._id) > -1 ?
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
	commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
		name: React.PropTypes.string.isRequired,
		avatar: React.PropTypes.shape({
			src: React.PropTypes.string.isRequired,
		})
	})).isRequired,
	updateDate: React.PropTypes.string.isRequired,
	userCanEditCommenters: React.PropTypes.arrayOf(React.PropTypes.string),
};
CommentUpperRight.defaultProps = {
	userCanEditCommenters: [],
};
/*
	END CommentUpperRight 
*/



/*
	BEGIN CommentUpper 
*/
const CommentUpper = (props) => {

	// const revision = getRevision(props.comment, props.selectedRevisionIndex);

	return (
		<div className={s['comment-upper']}>
			<CommentUpperLeft
				title={props.title}
			/>
			<CommentUpperRight
				commenters={props.commenters}
				updateDate={props.updateDate}
			/>
		</div>
	);
};
CommentUpper.propTypes = {
	title: React.PropTypes.string.isRequired,
	commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
		_id: React.PropTypes.string.isRequired,
		slug: React.PropTypes.string.isRequired,
		name: React.PropTypes.string.isRequired,
		avatar: React.PropTypes.shape({
			src: React.PropTypes.string.isRequired,
		})
	})).isRequired,
	updateDate: React.PropTypes.string.isRequired,
	userCanEditCommenters: React.PropTypes.arrayOf(React.PropTypes.string),

	// selectedRevisionIndex: React.PropTypes.number.isRequired,
	// comment: React.PropTypes.object.isRequired,
};
CommentUpper.defaultProps = {
	userCanEditCommenters: [],
};
/*
	END CommentUpper 
*/

export default CommentUpper;
export { CommentUpperLeft, CommentUpperRight };
