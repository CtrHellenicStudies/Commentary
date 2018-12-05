
import React from 'react';
import { compose } from 'react-apollo';

// graphql
import  discussionCommentsQuery from '../../../discussionComments/graphql/queries/discussionCommentsQuery';


const DiscussionContainer = props => {
	let discussionComments = [];

	return (
		<Discussion
			discussionComments={discussionComments}
		/>
	);
}


export default compose(
	discussionCommentsQuery
)(DiscussionContainer);
