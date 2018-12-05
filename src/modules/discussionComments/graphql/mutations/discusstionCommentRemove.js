import { gql, graphql } from 'react-apollo';

const discussionCommentRemove = gql`
	mutation discussionCommentRemove($id: String!) {
	discussionCommentRemove(discussionCommentId: $id) {
		_id
	}
}
 `;

const discussionCommentRemoveMutation = graphql(discussionCommentRemove, {
	props: (params) => ({
		discussionCommentRemove: (id) => params.discussionCommentRemoveMutation({variables: {id}}),
	}),
	name: 'discussionCommentRemoveMutation',
	options: {
		refetchQueries: ['discussionCommentsQuery']
	}
});

export default discussionCommentRemoveMutation;
