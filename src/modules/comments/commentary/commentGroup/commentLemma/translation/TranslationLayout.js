import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentLemmaText from './CommentLemmaText';
import CommentLemmaTextWithTranslation from './CommentLemmaTextWithTranslation';

class TranslationLayout extends Component {
	render() {
		const { commentGroup, showTranslation, lines, author } = this.props;
		return (
			<div>
				{showTranslation ?
					<CommentLemmaTextWithTranslation
						commentGroup={commentGroup}
						lines={lines}
						author={author}
					/>
					:
					 <CommentLemmaText lines={lines} />
				}
			</div>
		);
	}
}

TranslationLayout.propTypes = {
	commentGroup: PropTypes.object,
	showTranslation: PropTypes.bool,
	lines: PropTypes.array,
	author: PropTypes.string,
};

export default TranslationLayout;
