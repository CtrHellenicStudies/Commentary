import React from 'react';
import PropTypes from 'prop-types';

// components
import CommentGroupMetaWorkTitleContainer from '../../../containers/CommentGroupMetaWorkTitleContainer';
import AvatarIcon from '../../../../users/components/AvatarIcon';

// cts
import serializeUrn from '../../../../cts/lib/serializeUrn';


const getLineTo = ({ lemmaCitation }) => {
	if (
		lemmaCitation.passageTo
		&& lemmaCitation.passageTo.length
		&& !(lemmaCitation.passageFrom.join('.') === lemmaCitation.passageTo.join('.'))
	) {
		return `-${lemmaCitation.passageTo.join('.')}`;
	}
	return '';
};


const CommentGroupMeta = ({ hideLemma, commentGroup }) => {
	const commenters = [];

	let isInCommenters = false;
	Object.keys(commentGroup.commenters).forEach(key => {
		isInCommenters = false;
		commenters.forEach(commenter => {
			if (commentGroup.commenters[key].name === commenter.name) {
				isInCommenters = true;
			}
		});
		if (!isInCommenters) {
			commenters.push(commentGroup.commenters[key]);
		}
	})

	return (
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

						{commenters.map(commenter => (
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
											(commenter && commenter.avatar) ?
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
};

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
