import { gql, graphql } from 'react-apollo';

const query = gql`
query discussionComments {
	discussionComments {
		_id
		userId
		content
		parentId
		commentId
		status
		votes
		voters
		reported
		usersReported
		tenantId
	}
}
`;

const discussionCommentRemove = gql`
	mutation discussionCommentRemove($id: String!) {
	discussionCommentRemove(discussionCommentId: $id) {
		_id
	}
}
 `;

const discussionCommentUpdateStatus = gql`
	mutation discussionCommentUpdateStatus($id: String! $discussionComment: DiscussionCommentInputType!) {
	discussionCommentUpdateStatus(discussionCommentId: $id discussionComment: $discussionComment) {
		_id
		status
	}
}
 `;
 const discussionCommentUpdate = gql`
 mutation discussionCommentUpdate($id: String! $discussionComment: DiscussionCommentInputType!) {
	discussionCommentUpdate(discussionCommentId: $id discussionComment: $discussionComment) {
	 _id
	 comment
 }
}
`;

const discussionCommentsQuery = graphql(query, {
	name: 'discussionCommentsQuery'
});

const discussionCommentUpdateStatusMutation = graphql(discussionCommentUpdateStatus, {
	props: (params) => ({
		discussionCommentUpdateStatus: (id, discussionComment) => params.discussionCommentUpdateStatus({variables: {id, discussionComment}}),
	}),
	name: 'discussionCommentUpdateStatus',
	options: {
		refetchQueries: ['discussionComments']
	}
});
const discussionCommentUpdateMutation = graphql(discussionCommentUpdate, {
	props: (params) => ({
		discussionCommentUpdate: (id, discussionComment) => params.discussionCommentUpdate({variables: {id, discussionComment}}),
	}),
	name: 'discussionCommentUpdate',
	options: {
		refetchQueries: ['discussionComments']
	}
});

const discussionCommentRemoveMutation = graphql(discussionCommentRemove, {
	props: (params) => ({
		discussionCommentRemove: (id) => params.discussionCommentRemoveMutation({variables: {id}}),
	}),
	name: 'discussionCommentRemoveMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});

export {discussionCommentsQuery, discussionCommentUpdateStatusMutation, discussionCommentRemoveMutation, discussionCommentUpdateMutation}