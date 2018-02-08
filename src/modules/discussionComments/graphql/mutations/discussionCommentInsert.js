import { gql, graphql } from 'react-apollo';

const discussionCommentInsert = gql`
mutation discussionCommentInsert($discussionContent: String! $commentId: String! $tenantId: String!) {
	discussionCommentInsert(discussionContent: $discussionContent commentId: $commentId tenantId: $tenantId) {
	content
	commentId
	tenantId
}
}
`;
const discussionCommentInsertMutation = graphql(discussionCommentInsert, {
	props: (params) => ({
		discussionCommentInsert: (discussionContent, commentId, tenantId) => params.discussionCommentInsertMutation({variables: {discussionContent, commentId, tenantId}}),
	}),
	name: 'discussionCommentInsertMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});

export default discussionCommentInsertMutation;
