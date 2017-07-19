import React from 'react';

import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText';
import Translation from '/imports/ui/components/commentary/commentGroups/Translation'; 

class TranslationLayout extends React.Component {
	render() {
		const { commentGroup, showTranslation, lines, author } = this.props;

		return (
			<div>
				{showTranslation ?
					<Translation 
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

export default TranslationLayout;
