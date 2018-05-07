import React from 'react';

import './CommentGroupMetaWorkTitle.css';


const CommentGroupMetaWorkTitle = ({ textGroupTitle, workTitle }) => (
	<div className="commentGroupMetaWorkTitle">
		<span className="commentGroupMetaWorkTitlePart">
			{textGroupTitle}
		</span>
		<span className="commentGroupMetaWorkTitlePart">
			{workTitle}
		</span>
	</div>
);


export default CommentGroupMetaWorkTitle;
