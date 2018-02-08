import { gql, graphql } from 'react-apollo';

const query = gql`
query discussionComments($commentId: String $tenantId: String $userId: String){
	discussionComments(commentId: $commentId tenantId: $tenantId userId: $userId){
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
const discussionCommentsQuery = graphql(query, {
	name: 'discussionCommentsQuery',
});

export default discussionCommentsQuery;
