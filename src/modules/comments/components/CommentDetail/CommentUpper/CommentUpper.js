import React from 'react';
import PropTypes from 'prop-types';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';

import AvatarIcon from '../../../../users/components/AvatarIcon';

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
const CommentUpperRight = props => {
	const commenters = [];

	let isInCommenters = false;
	Object.keys(props.commenters).forEach(key => {
		isInCommenters = false;
		commenters.forEach(commenter => {
			if (props.commenters[key].name === commenter.name) {
				isInCommenters = true;
			}
		});
		if (!isInCommenters) {
			commenters.push(props.commenters[key]);
		}
	});

	return (
		<div className="comment-upper-right">
			{commenters.map(commenter => ((
				props.userCanEditCommenters.indexOf(commenter._id) > -1) ?
				<Link to={`/commentary/${props.commentId}/edit`}>
					<FlatButton
						label="Edit comment"
						icon={<FontIcon className="mdi mdi-pen" />}
					/>
				</Link>
				:
				''
			))}
			{commenters.map(commenter => (
				<div
					key={commenter._id}
					className="comment-author"
				>
					<div className="comment-author-text">
						<Link to={`/commenters/${commenter.slug}`}>
							<span className="comment-author-name">{commenter.name}</span>
						</Link>
						<span>
							{props.updateDate}
						</span>
					</div>
					<div className="comment-author-image-wrap paper-shadow">
						<Link to={`/commenters/${commenter.slug}`}>
							<AvatarIcon
								avatar={
									(commenter && commenter.avatar) ?
										commenter.avatar.src
										: null
								}
							/>
						</Link>
					</div>
				</div>
			))}
		</div>
	);
};
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

export { CommentUpperLeft, CommentUpperRight };
export default CommentUpper;
