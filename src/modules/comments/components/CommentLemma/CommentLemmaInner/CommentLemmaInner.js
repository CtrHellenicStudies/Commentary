import React from 'react';
import PropTypes from 'prop-types';

// components
import CommentLemmaText from '../CommentLemmaText';
import CommentLemmaTranslation from '../CommentLemmaTranslation';


class CommentLemmaInner extends React.Component {
	render() {
		const { commentGroup, showTranslation, textNodes, author } = this.props;
		return (
			<div>
				{showTranslation ?
					<CommentLemmaTranslation
						commentGroup={commentGroup}
						textNodes={textNodes}
						author={author}
					/>
					:
					<CommentLemmaText
						textNodes={textNodes}
					/>
				}
			</div>
		);
	}
}

CommentLemmaInner.propTypes = {
	commentGroup: PropTypes.object,
	showTranslation: PropTypes.bool,
	textNodes: PropTypes.array,
	author: PropTypes.string,
};

export default CommentLemmaInner;
