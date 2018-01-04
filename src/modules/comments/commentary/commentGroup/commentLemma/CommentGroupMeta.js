import React from 'react';
import PropTypes from 'prop-types';
import AvatarIcon from '../../../../profile/avatar/AvatarIcon';

const getWorkTitle = (commentGroup) => {
	let workTitle = commentGroup.work.title;
	if (workTitle === 'Homeric Hymns') {
		workTitle = 'Hymns';
	}
	return workTitle;
};

const getLineTo = (commentGroup) => {
	if (commentGroup.lineTo === commentGroup.lineFrom || !commentGroup.lineTo) {
		return '';
	}
	return `- ${commentGroup.lineTo}`;
};

const CommentGroupMeta = ({ hideLemma, commentGroup }) => (
	<div className="comment-group-meta">
		{hideLemma === false ?
			<div className="comment-group-meta-inner comment-group-meta-ref">
				<div className="comment-group-ref">
					<span className="comment-group-ref-above">
						{getWorkTitle(commentGroup)} {commentGroup.subwork.title}
					</span>
					<h2 className="comment-group-ref-below">
						{commentGroup.lineFrom}{getLineTo(commentGroup)}
					</h2>

				</div>
				<div className="comment-group-commenters">

					{Object.keys(commentGroup.commenters).map(key => (
						<div
							key={commentGroup.commenters[key]._id}
							className="comment-author"
							data-commenter-id={commentGroup.commenters[key]._id}
						>
							<span className="comment-author-name">
								{commentGroup.commenters[key].name}
							</span>
							<a
								className="comment-author-image-wrap paper-shadow"
								href={`/commenters/${commentGroup.commenters[key].slug}`}
							>
								<AvatarIcon
									avatar={
										(commentGroup.commenters[key] && commentGroup.commenters[key].avatar) ?
										commentGroup.commenters[key].avatar.src
										: null
									}
								/>
							</a>
						</div>
					))}
				</div>
			</div>
		: '' }
	</div>
);
CommentGroupMeta.propTypes = {
	hideLemma: PropTypes.bool,
	commentGroup: PropTypes.shape({
		subwork: PropTypes.shape({
			title: PropTypes.string.isRequired,
		}),
		lineFrom: PropTypes.number.isRequired,
		lineTo: PropTypes.number,
		commenters: PropTypes.objectOf(PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			slug: PropTypes.string.isRequired,
			avatar: PropTypes.shape({
				src: PropTypes.string,
			})
		}))
	}),
};
CommentGroupMeta.defaultProps = {
	hideLemma: false,
	commentGroup: null,
};

export default CommentGroupMeta;
