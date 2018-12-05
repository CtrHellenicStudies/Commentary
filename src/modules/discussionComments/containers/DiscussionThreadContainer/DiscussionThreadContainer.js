import React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// graphql
import discussionCommentInsert from '../../graphql/mutations/discussionCommentInsert';
import discussionCommentsQuery  from '../../graphql/queries/discussionCommentsQuery';
import usersQuery from '../../../users/graphql/queries/users';

// component
import DiscussionThread from '../../components/DiscussionThread';


const DiscussionThreadContainer = props => {
	let discussionComments = [];

	return (
		<DiscussionThread
			discussionCommentsDisabled
			discussionComments={discussionComments}
		/>
	);
}


const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	discussionCommentsQuery,
	discussionCommentInsert,
	usersQuery,
	connect(mapStateToProps),
)(DiscussionThreadContainer);
