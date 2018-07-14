import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';

import AvatarIcon from '../../../../profile/components/AvatarIcon/AvatarIcon';

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
		{Object.keys(props.commenters).map(key => ((props.userCanEditCommenters.indexOf(props.commenters[key]._id) > -1) ?
			<Link to={`/commentary/${props.commentId}/edit`}>
				<FlatButton
					label="Edit comment"
					icon={<FontIcon className="mdi mdi-pen" />}
				/>
			</Link>
			:
			''
		))}
		{Object.keys(props.commenters).map(key => (
			<div
				key={props.commenters[key]._id}
				className="comment-author"
			>
				<div className={'comment-author-text'}>
					<Link to={`/commenters/${props.commenters[key].slug}`}>
						<span className="comment-author-name">{props.commenters[key].name}</span>
					</Link>
					<span>
						{props.updateDate}
					</span>
				</div>
				<div className="comment-author-image-wrap paper-shadow">
					<Link to={`/commenters/${props.commenters[key].slug}`}>
						<AvatarIcon
							avatar={
								(props.commenters[key] && props.commenters[key].avatar) ?
									props.commenters[key].avatar.src
									: null
							}
						/>
					</Link>
				</div>
			</div>
		))}
	</div>
);
CommentUpperRight.propTypes = {
	commenters: PropTypes.objectOf(PropTypes.shape({
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
	commenters: PropTypes.objectOf(PropTypes.shape({
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
