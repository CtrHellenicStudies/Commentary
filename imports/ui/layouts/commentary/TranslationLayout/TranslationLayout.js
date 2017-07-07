import React from 'react';

import CommentLemmaText from '/imports/ui/components/commentary/commentGroups/CommentLemmaText';
import Translation from '/imports/ui/components/commentary/commentGroups/Translation'; 

const TranslationLayout = (props) =>
	<div className="row">
		<div className="col-md-5">
			{props.children}
		</div>
		<div className="col-md-7">
			<Translation 
				commentGroup={commentGroup}
			/>
		</div>
	</div>;

export default TranslationLayout;
