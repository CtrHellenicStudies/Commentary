import React from 'react';
import { compose } from 'react-apollo';

import workTitleQuery from '../../graphql/queries/workTitle';
import CommentGroupMetaWorkTitle from '../../components/CommentLemma/CommentGroupMetaWorkTitle';



const CommentGroupMetaWorkTitleContainer = props => {
	let textGroupTitle = '';
	let workTitle = '';

	if (props.workTitleQuery) {
		if (
			props.workTitleQuery.textGroups
	    && props.workTitleQuery.textGroups.length
		) {
			textGroupTitle = props.workTitleQuery.textGroups[0].title
		}

		if (
			props.workTitleQuery.works
	    && props.workTitleQuery.works.length
		) {
			workTitle = props.workTitleQuery.works[0].english_title;
		}
	}


	return (
		<CommentGroupMetaWorkTitle
			textGroupTitle={textGroupTitle}
			workTitle={workTitle}
		/>
	);
};

export default compose(
	workTitleQuery,
)(CommentGroupMetaWorkTitleContainer);
