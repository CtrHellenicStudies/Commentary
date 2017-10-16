import React from 'react';
import PropTypes from 'prop-types';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';

/*
	BEGIN CommentUpperLeft
*/
const CommentUpperLeft = props => (
	<div className="comment-upper-left">
		<h1>{props.title}</h1>
	</div>
);
CommentUpperLeft.propTypes = {
	title: PropTypes.string.isRequired,
};
/*
	END CommentUpperLeft
*/


/*
	BEGIN CommentUpperRight
*/
const CommentUpperRight = props => (
	<div className="comment-upper-right">
		{_.every(props.commenters, commenter => props.userCanEditCommenters.indexOf(commenter._id) > -1) ?
			<FlatButton
				label="Edit comment"
				href={`/commentary/${props.commentId}/edit`}
				icon={<FontIcon className="mdi mdi-pen" />}
			/>
			:
			''
		}
		{props.commenters.map(commenter => (
			<div
				key={commenter._id}
				className="comment-author"
			>
				<div className={'comment-author-text'}>
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
	commenters: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		avatar: PropTypes.shape({
			src: PropTypes.string.isRequired,
		})
	})).isRequired,
	commentId: PropTypes.string.isRequired,
	updateDate: PropTypes.string.isRequired,
	userCanEditCommenters: PropTypes.arrayOf(PropTypes.string),
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
const CommentUpper = props => (
	<div className="comment-upper">
		{!props.hideTitle && <CommentUpperLeft
			title={props.title}
		/>}
		{!props.hideCommenters && <CommentUpperRight
			commenters={props.commenters}
			commentId={props.commentId}
			updateDate={props.updateDate}
			userCanEditCommenters={props.userCanEditCommenters}
		/>}
	</div>
);
CommentUpper.propTypes = {
	title: PropTypes.string.isRequired,
	commentId: PropTypes.string.isRequired,
	commenters: PropTypes.arrayOf(PropTypes.shape({
		_id: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		avatar: PropTypes.shape({
			src: PropTypes.string.isRequired,
		})
	})).isRequired,
	updateDate: PropTypes.string.isRequired,
	userCanEditCommenters: PropTypes.arrayOf(PropTypes.string),
	hideTitle: PropTypes.bool,
	hideCommenters: PropTypes.bool,
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
