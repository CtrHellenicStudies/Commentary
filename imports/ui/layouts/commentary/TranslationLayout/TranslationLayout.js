import React from 'react';
import PropTypes from 'prop-types';
import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText';
import CommentLemmaTextWithTranslation from '/imports/ui/components/commentary/commentGroups/CommentLemmaTextWithTranslation';

class TranslationLayout extends React.Component {
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
	showTranslation: PropTypes.func,
	lines: PropTypes.array,
	author: PropTypes.object,
};

export default TranslationLayout;
