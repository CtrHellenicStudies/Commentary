import React from 'react';
import PropTypes from 'prop-types';

import CommentGroupMetaWorkTitleContainer from '../../../containers/CommentGroupMetaWorkTitleContainer';
import AvatarIcon from '../../../../profile/components/AvatarIcon/AvatarIcon';
import serializeUrn from '../../../../cts/lib/serializeUrn';


const getLineTo = ({ lemmaCitation }) => {
	if (lemmaCitation.passageTo && lemmaCitation.passageTo.length) {
		return `- ${lemmaCitation.passageTo.join('.')}`;
	}
	return '';
};


const CommentGroupMeta = ({ hideLemma, commentGroup }) => (
	<div className="comment-group-meta">
		{hideLemma === false ?
			<div className="comment-group-meta-inner comment-group-meta-ref">
				<div className="comment-group-ref">

					<CommentGroupMetaWorkTitleContainer
						textGroupUrn={serializeUrn(commentGroup.lemmaCitation, 'textGroup')}
						workUrn={serializeUrn(commentGroup.lemmaCitation, 'work')}
					/>
					<h2 className="comment-group-ref-below">
						{commentGroup.lemmaCitation.passageFrom.join('.')}{getLineTo(commentGroup)}
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
		lemmaCitation: PropTypes.shape({
			textGroup: PropTypes.string,
			work: PropTypes.string,
			passageFrom: PropTypes.arrayOf(PropTypes.number),
			passageTo: PropTypes.arrayOf(PropTypes.number),
		}),
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
