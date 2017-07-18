import React from 'react';

import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText';
import Translation from '/imports/ui/components/commentary/commentGroups/Translation'; 

class TranslationLayout extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { commentGroup, showTranslation, lines } = this.props;

		return (
			<div>
				{showTranslation ?
					<Translation 
						commentGroup={commentGroup}
						lines={lines}
					/>
					:
					<CommentLemmaText lines={lines} />
				}
			</div>
		);
	}
}

export default TranslationLayout;
