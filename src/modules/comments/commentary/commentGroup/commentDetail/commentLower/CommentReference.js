import React from 'react';
import PropTypes from 'prop-types';

const CommentReference = (props) => {
	if (props.referenceWorks && props.referenceWorks.length) {
		return (
			<div className="comment-reference">
				<h4>Secondary Source(s):</h4>
				<span>
					{props.referenceWorks.map((referenceWork, i) => {
						const isLast = (i === props.referenceWorks.length - 1);

						return (
							<span
								key={referenceWork.slug}
								className="referenceWork"
							>
								{isLast ? ' ' : ''}
								<a
									href={`/referenceWorks/${referenceWork.slug}`}
									rel="noopener noreferrer"
									target="_blank"
								>
									{referenceWork.title}{isLast ? '' : ','}
								</a>
							</span>
						);
					})}
				</span>
			</div>
		);
	}
	return null;
};
CommentReference.propTypes = {
	referenceWorks: PropTypes.arrayOf(PropTypes.shape({
		title: PropTypes.string.isRequired,
		slug: PropTypes.string.isRequired,
	})),
};
CommentReference.defaultProps = {
	referenceWorks: null,
};

export default CommentReference;
