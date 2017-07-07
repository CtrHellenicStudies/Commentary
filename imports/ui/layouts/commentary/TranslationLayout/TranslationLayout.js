import React from 'react';

import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText';
import Translation from '/imports/ui/components/commentary/commentGroups/Translation'; 

const TranslationLayout = (props) =>
	<div className="row">
		<div className="col-md-6">
			{props.children}
		</div>
		<div className="col-md-6">
			<Translation 
				commentGroup={props.commentGroup}
			/>
		</div>
	</div>;

export default TranslationLayout;
