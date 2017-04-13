import AvatarIcon from '/imports/avatar/client/ui/AvatarIcon.jsx';  // eslint-disable-line import/no-absolute-path
import FontIcon from 'material-ui/FontIcon';


/*
	BEGIN CommentUpperLeft 
*/
const CommentUpperLeft = props => (
	<div className="comment-upper-left">
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
	<div className="comment-upper-right">
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
				<div className={"comment-author-text"}>
					<a href={`/commenters/${commenter.slug}`}>
						<span className="comment-author-name">{commenter.name}</span>
					</a>
					<span>
						{props.updateDate}
					</span>
				</div>
				<div className="comment-author-image-wrap paper-shadow">
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
const CommentUpper = (props) => (
	<div className="comment-upper">
		{!props.hideTitle && <CommentUpperLeft
			title={props.title}
		/>}
		{!props.hideCommenters && <CommentUpperRight
			commenters={props.commenters}
			updateDate={props.updateDate}
		/>}
	</div>
);
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
	hideTitle: React.PropTypes.bool,
	hideCommenters: React.PropTypes.bool,
};
CommentUpper.defaultProps = {
	userCanEditCommenters: [],
	hideTitle: false,
	hideCommenters: false,
};
/*
	END CommentUpper 
*/

export default CommentUpper;
export { CommentUpperLeft, CommentUpperRight };
