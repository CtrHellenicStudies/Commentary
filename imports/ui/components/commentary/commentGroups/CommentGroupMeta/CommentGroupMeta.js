import React from 'react';
import AvatarIcon from '/imports/ui/components/avatar/AvatarIcon'; // eslint-disable-line import/no-absolute-path

const getWorkTitle = (commentGroup) => {
	let workTitle = commentGroup.work.title;
	if (workTitle === 'Homeric Hymns') {
		workTitle = 'Hymns';
	}
	return workTitle;
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
						{commentGroup.lineFrom}{commentGroup.lineTo ? `-${commentGroup.lineTo}` : '' }
					</h2>

				</div>
				<div className="comment-group-commenters">

					{commentGroup.commenters.map(commenter => (
						<div
							key={commenter._id}
							className="comment-author"
							data-commenter-id={commenter._id}
						>
							<span className="comment-author-name">
								{commenter.name}
							</span>
							<a
								className="comment-author-image-wrap paper-shadow"
								href={`/commenters/${commenter.slug}`}
							>
								<AvatarIcon
									avatar={
										(commenter && 'avatar' in commenter) ?
										commenter.avatar.src
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
	hideLemma: React.PropTypes.bool,
	commentGroup: React.PropTypes.shape({
		subwork: React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
		}),
		lineFrom: React.PropTypes.number.isRequired,
		lineTo: React.PropTypes.number,
		commenters: React.PropTypes.arrayOf(React.PropTypes.shape({
			_id: React.PropTypes.string.isRequired,
			name: React.PropTypes.string.isRequired,
			slug: React.PropTypes.string.isRequired,
			avatar: React.PropTypes.shape({
				src: React.PropTypes.string,
			})
		}))
	}),
};
CommentGroupMeta.defaultProps = {
	hideLemma: false,
	commentGroup: null,
};

export default CommentGroupMeta;
