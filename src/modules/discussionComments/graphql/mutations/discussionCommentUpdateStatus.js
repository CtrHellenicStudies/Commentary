import { gql, graphql } from 'react-apollo';

const discussionCommentUpdateStatus = gql`
	mutation discussionCommentUpdateStatus($id: String! $discussionCommentStatus: DiscussionCommentInputType!) {
	discussionCommentUpdateStatus(discussionCommentId: $id discussionCommentStatus: $discussionCommentStatus) {
		_id
		status
	}
}
 `;

const discussionCommentUpdateStatusMutation = graphql(discussionCommentUpdateStatus, {
	props: (params) => ({
		discussionCommentUpdateStatus: (id, discussionCommentStatus) => params.discussionCommentUpdateStatus({variables: {id, discussionCommentStatus}}),
	}),
	name: 'discussionCommentUpdateStatus',
	options: {
		refetchQueries: ['discussionComments']
	}
});

export default discussionCommentUpdateStatusMutation;
