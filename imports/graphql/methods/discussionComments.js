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
const discussionCommentReport = gql`
 	mutation discussionCommentReport($id: String!) {
 	discussionCommentReport(discussionCommentId: $id) {
	 	_id
 	}
}
`;
const discussionCommentUnreport = gql`
	mutation discussionCommentUnreport($id: String!) {
	discussionCommentUnreport(discussionCommentId: $id) {
		_id
	}
}
`;
const discussionCommentUpvote = gql`
	mutation discussionCommentUpvote($id: String!) {
	discussionCommentUpvote(discussionCommentId: $id) {
		_id
	}
}
`;

const discussionCommentUpdateStatus = gql`
	mutation discussionCommentUpdateStatus($id: String! $discussionCommentStatus: DiscussionCommentInputType!) {
	discussionCommentUpdateStatus(discussionCommentId: $id discussionCommentStatus: $discussionCommentStatus) {
		_id
		status
	}
}
 `;
const discussionCommentUpdate = gql`
 mutation discussionCommentUpdate($id: String! $discussionContent: String!) {
	discussionCommentUpdate(discussionCommentId: $id discussionContent: $discussionContent) {
	 _id
	 content
 }
}
`;
const discussionCommentInsert = gql`
mutation discussionCommentInsert($discussionContent: String! $commentId: String! $tenantId: String!) {
	discussionCommentInsert(discussionContent: $discussionContent commentId: $commentId tenantId: $tenantId) {
	content
	commentId
	tenantId
}
}
`;
const discussionCommentsQuery = graphql(query, {
	name: 'discussionCommentsQuery'
});

const discussionCommentUpdateStatusMutation = graphql(discussionCommentUpdateStatus, {
	props: (params) => ({
		discussionCommentUpdateStatus: (id, discussionCommentStatus) => params.discussionCommentUpdateStatus({variables: {id, discussionCommentStatus}}),
	}),
	name: 'discussionCommentUpdateStatus',
	options: {
		refetchQueries: ['discussionComments']
	}
});
const discussionCommentUpdateMutation = graphql(discussionCommentUpdate, {
	props: (params) => ({
		discussionCommentUpdate: (id, discussionContent) => params.discussionCommentUpdate({variables: {id, discussionContent}}),
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

const discussionCommentReportMutation = graphql(discussionCommentReport, {
	props: (params) => ({
		discussionCommentReport: (id) => params.discussionCommentReportMutation({variables: {id}}),
	}),
	name: 'discussionCommentReportMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});
const discussionCommentUnreportMutation = graphql(discussionCommentUnreport, {
	props: (params) => ({
		discussionCommentUnreport: (id) => params.discussionCommentUnreportMutation({variables: {id}}),
	}),
	name: 'discussionCommentUnreportMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});
const discussionCommentUpvoteMutation = graphql(discussionCommentUpvote, {
	props: (params) => ({
		discussionCommentUpvote: (id) => params.discussionCommentUpvoteMutation({variables: {id}}),
	}),
	name: 'discussionCommentUpvoteMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});
const discussionCommentInsertMutation = graphql(discussionCommentInsert, {
	props: (params) => ({
		discussionCommentInsert: (discussionContent, commentId, tenantId) => params.discussionCommentInsertMutation({variables: {discussionContent, commentId, tenantId}}),
	}),
	name: 'discussionCommentInsertMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});

export {discussionCommentsQuery,
		discussionCommentUpdateStatusMutation,
		discussionCommentRemoveMutation,
		discussionCommentUpdateMutation,
		discussionCommentReportMutation,
		discussionCommentUnreportMutation,
		discussionCommentUpvoteMutation,
		discussionCommentInsertMutation };
